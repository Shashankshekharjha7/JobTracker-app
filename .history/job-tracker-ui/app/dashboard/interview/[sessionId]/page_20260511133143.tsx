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
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
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
  const [results, setResults] = useState<any[]>([]);

  const {
    transcript,
    status,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

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

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !questions[currentIndex]) return;

    setSubmitting(true);
    try {
      const response = await api.post(
        `/interviews/questions/${questions[currentIndex].id}/answer`,
        { answer: answer.trim() }
      );

      const result = {
        question: questions[currentIndex].question,
        answer: answer.trim(),
        score: response.data.analysis?.contentScore || 0,
        feedback: response.data.feedback,
        strengths: response.data.analysis?.strengths || [],
        improvements: response.data.analysis?.improvements || [],
      };

      setResults([...results, result]);
      setFeedback(result);

      // Auto-advance after 5 seconds
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          handleNextQuestion();
        } else {
          router.push(`/dashboard/interview/results/${params.sessionId}`);
        }
      }, 5000);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setAnswer("");
    setFeedback(null);
    resetTranscript();
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswer("");
      setFeedback(null);
      resetTranscript();
    }
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

  if (showInstructions) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-none">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-full">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interview Instructions
              </h1>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="text-lg">
                Welcome to your AI-powered interview practice session!
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  How it works:
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      You'll be asked {questions.length} questions based on the
                      job description
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Type your answers or use voice input (microphone)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      You'll receive instant AI feedback after each answer
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Take your time - there's no time limit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      At the end, you'll see a complete performance summary
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                  💡 Tip: Use the STAR method (Situation, Task, Action, Result)
                  for behavioral questions
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => router.push("/dashboard/interview")}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowInstructions(false)}
                className="gap-2"
              >
                Start Interview
                <ArrowRight className="w-4 h-4" />
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question Card */}
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Badge variant="outline">{currentQuestion.category}</Badge>
              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Answer
              </label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use the microphone..."
                rows={8}
                className="resize-none"
                disabled={submitting}
              />
            </div>

            {/* Voice Input */}
            {isSupported && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={
                    status === "listening" ? stopListening : startListening
                  }
                  variant={status === "listening" ? "destructive" : "outline"}
                  size="sm"
                  disabled={submitting}
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
                {status === "listening" && (
                  <span className="text-sm text-red-600 animate-pulse">
                    ● Recording...
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? "Analyzing..." : "Submit Answer"}
            </Button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                  AI Feedback
                </h3>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {feedback.score}/100
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                {feedback.feedback}
              </p>

              {feedback.strengths?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                    Strengths:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {feedback.strengths.map((strength: string, i: number) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                    Areas for Improvement:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {feedback.improvements.map(
                      (improvement: string, i: number) => (
                        <li key={i}>{improvement}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Moving to next question in 5 seconds...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentIndex === 0}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNextQuestion}
          disabled={currentIndex === questions.length - 1}
          variant="outline"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
