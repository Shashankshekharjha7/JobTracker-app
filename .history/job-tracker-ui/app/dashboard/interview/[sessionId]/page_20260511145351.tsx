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

  // Transcript sync
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  // Timer logic
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
        `/interviews/jobs/${params.sessionId}/questions`
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
      JSON.stringify(results)
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
        }
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

      // Save results safely
      localStorage.setItem(
        `interview-results-${params.sessionId}`,
        JSON.stringify(updatedResults)
      );

      // Auto next
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />

        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No questions available for this job
        </p>

        <Button onClick={() => router.push("/dashboard/interview")}>
          Go Back
        </Button>
      </div>
    );
  }

  // Instructions Page
  if (showInstructions) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <Card className="border-none bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <Info className="w-6 h-6 text-white" />
              </div>

              <h1 className="text-2xl font-bold">
                Interview Instructions
              </h1>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>
                  You will have <strong>30 minutes</strong> to complete the
                  interview.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>
                  You can type answers or use voice input with automatic
                  transcription.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>
                  AI feedback and score will be generated for each question.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />

                <p>
                  Results will be shown after the interview ends.
                </p>
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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* TOP BAR */}
      <div className="sticky top-4 z-20">
        <Card className="backdrop-blur bg-white/90 dark:bg-gray-900/90 shadow-lg border">
          <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">
                Interview Session
              </h2>

              <p className="text-sm text-gray-500">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            {/* TIMER */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <Clock3 className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Remaining Time
                </p>

                <p
                  className={`text-2xl font-bold ${
                    timeLeft < 300
                      ? "text-red-600 animate-pulse"
                      : "text-blue-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Badge variant="outline">
                {currentQuestion.category}
              </Badge>

              <Badge variant="outline">
                {currentQuestion.difficulty}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold leading-relaxed">
              {currentQuestion.question}
            </h1>
          </div>

          {/* ANSWER AREA */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-gray-50 dark:bg-gray-900 p-4 min-h-[250px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Your Answer
                </h3>

                {status === "listening" && (
                  <div className="flex items-center gap-2 text-red-500 animate-pulse text-sm">
                    ● Listening...
                  </div>
                )}
              </div>

              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Start typing or speaking..."
                className="min-h-[180px] border-0 bg-transparent focus-visible:ring-0 resize-none text-base"
                disabled={submitting}
              />
            </div>

            {/* VOICE BUTTONS */}
            {isSupported && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={
                    status === "listening"
                      ? "destructive"
                      : "outline"
                  }
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
              className="w-full h-12 text-base"
            >
              {submitting
                ? "Analyzing Answer..."
                : "Submit Answer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FEEDBACK */}
      {feedback && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                AI Feedback
              </h2>

              <div className="text-3xl font-bold text-green-600">
                {feedback.score}/100
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              {feedback.feedback}
            </p>

            {feedback.strengths?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  Strengths
                </h3>

                <ul className="list-disc ml-5 space-y-1">
                  {feedback.strengths.map(
                    (item: string, index: number) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {feedback.improvements?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  Improvements
                </h3>

                <ul className="list-disc ml-5 space-y-1">
                  {feedback.improvements.map(
                    (item: string, index: number) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* RESULTS SECTION */}
      {results.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">
              Submitted Answers
            </h2>

            {results.map((result, index) => (
              <div
                key={index}
                className="rounded-xl border p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Question {index + 1}
                  </h3>

                  <Badge>{result.score}/100</Badge>
                </div>

                <p className="font-medium">
                  {result.question}
                </p>

                <div>
                  <p className="text-sm font-medium mb-1">
                    Your Answer:
                  </p>

                  <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-sm">
                    {result.answer}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">
                    AI Feedback:
                  </p>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm">
                    {result.feedback}
                  </div>
                </div>
              </div>
            ))}
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