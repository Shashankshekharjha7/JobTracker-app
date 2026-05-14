"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

import {
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Clock3,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface Result {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);

  const [results, setResults] = useState<Result[]>([]);

  // 30 minute timer
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const {
    transcript,
    status,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition();

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Sync transcript with textarea
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  // Anti cheating + fullscreen
  

  // Timer
  useEffect(() => {
    if (showInstructions) return;

    if (timeLeft <= 0) {
      finishInterview();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showInstructions]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(
        `/interviews/jobs/${params.sessionId}/questions`,
      );

      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const finishInterview = () => {
    stopListening();

    localStorage.setItem(
      `interview-results-${params.sessionId}`,
      JSON.stringify(results),
    );

    router.push(`/dashboard/interview/results/${params.sessionId}`);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !questions[currentIndex]) return;

    setSubmitting(true);

    try {
      const response = await api.post(
        `/interviews/questions/${questions[currentIndex].id}/answer`,
        {
          answer: answer.trim(),
        },
      );

      const result: Result = {
        question: questions[currentIndex].question,
        answer: answer.trim(),
        score: response.data.analysis?.contentScore || 0,
        feedback: response.data.feedback,
        strengths: response.data.analysis?.strengths || [],
        improvements: response.data.analysis?.improvements || [],
      };

      const updatedResults = [...results, result];

      setResults(updatedResults);

      setFeedback(result);

      localStorage.setItem(
        `interview-results-${params.sessionId}`,
        JSON.stringify(updatedResults),
      );

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          handleNextQuestion();
        } else {
          finishInterview();
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1) return;

    setCurrentIndex((prev) => prev + 1);

    setAnswer("");
    setFeedback(null);

    resetTranscript();
  };

  const handlePreviousQuestion = () => {
    if (currentIndex <= 0) return;

    setCurrentIndex((prev) => prev - 1);

    setAnswer("");
    setFeedback(null);

    resetTranscript();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />

        <p className="text-gray-500 mb-4">No questions available</p>

        <Button onClick={() => router.push("/dashboard/interview")}>
          Go Back
        </Button>
      </div>
    );
  }

  // Instructions Page
  if (showInstructions) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Card className="border-none bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <Info className="w-6 h-6 text-white" />
              </div>

              <h1 className="text-3xl font-bold">Interview Instructions</h1>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>
                  Total time: <strong>30 Minutes</strong>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>Fullscreen mode is required</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>Tab switching will end the interview automatically</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>Voice transcription is enabled</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/interview")}
              >
                Cancel
              </Button>

              <Button onClick={() => setShowInstructions(false)}>
                Start Interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* TOP BAR */}
      <Card className="sticky top-4 z-20 shadow-lg">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Interview Session</h2>

            <p className="text-sm text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="text-red-500" />

            <div>
              <p className="text-xs text-gray-500">Time Left</p>

              <p className="text-2xl font-bold text-red-600">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PROGRESS */}
      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Interview Progress</span>

          <span>{Math.round(progress)}%</span>
        </div>

        <Progress value={progress} />
      </div>

      {/* QUESTION */}
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge variant="outline">{currentQuestion.category}</Badge>

              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>

            <h1 className="text-2xl font-bold">{currentQuestion.question}</h1>
          </div>

          {/* ANSWER AREA */}
          <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-4 min-h-[250px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Your Answer</h3>

              {status === "listening" && (
                <div className="text-red-500 animate-pulse text-sm">
                  ● Listening...
                </div>
              )}
            </div>

            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or speak your answer..."
              className="min-h-[180px]
                        border-0
                        bg-transparent
                        focus-visible:ring-0
                        resize-none
                        text-base
                        text-black
                        dark:text-white
                        placeholder:text-gray-500"
              disabled={submitting}
            />
          </div>

          {/* VOICE */}
          {isSupported && (
            <div className="flex gap-3">
              <Button
                variant={status === "listening" ? "destructive" : "outline"}
                onClick={() => {
                  if (status === "listening") {
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
              >
                {status === "listening" ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Voice Input
                  </>
                )}
              </Button>
            </div>
          )}

          {/* SUBMIT */}
          <Button
            onClick={handleSubmitAnswer}
            disabled={!answer.trim() || submitting}
            className="w-full h-12"
          >
            {submitting ? "Analyzing..." : "Submit Answer"}
          </Button>
        </CardContent>
      </Card>

      {/* FEEDBACK */}
      {feedback && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">AI Feedback</h2>

              <div className="text-3xl font-bold text-green-600">
                {feedback.score}/100
              </div>
            </div>

            <p>{feedback.feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* NAVIGATION */}
      <div className="flex justify-between pb-10">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={handlePreviousQuestion}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          variant="outline"
          disabled={currentIndex === questions.length - 1}
          onClick={handleNextQuestion}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
