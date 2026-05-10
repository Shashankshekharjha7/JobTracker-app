"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";

import { api } from "@/lib/api";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  company: string;
  role: string;
}

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface Result {
  questionId: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

export default function InterviewPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<Question | null>(null);

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    status,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchQuestions(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const fetchQuestions = async (jobId: string) => {
    setLoading(true);

    try {
      const response = await api.get(
        `/interviews/jobs/${jobId}/questions`
      );

      setQuestions(response.data);

      if (response.data.length > 0) {
        setCurrentQuestion(response.data[0]);
      } else {
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error(
        "Failed to fetch questions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBeginRecording = () => {
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !transcript.trim()) {
      return;
    }

    try {
      const response = await api.post(
        `/interviews/questions/${currentQuestion.id}/answer`,
        {
          answer: transcript,
        }
      );

      const newResult: Result = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: transcript,
        score:
          response.data.analysis?.contentScore || 0,
        feedback: response.data.feedback,
      };

      setResults((prev) => [...prev, newResult]);

      const currentIndex = questions.findIndex(
        (q) => q.id === currentQuestion.id
      );

      if (currentIndex < questions.length - 1) {
        setCurrentQuestion(
          questions[currentIndex + 1]
        );
        resetTranscript();
      } else {
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error(
        "Failed to submit answer:",
        error
      );
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Interview Practice
        </h1>

        <p className="text-muted-foreground">
          Practice your interview skills with
          AI-powered feedback
        </p>
      </div>

      {/* Job Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Job</CardTitle>
        </CardHeader>

        <CardContent>
          <select
            value={selectedJobId}
            onChange={(e) =>
              setSelectedJobId(e.target.value)
            }
            className="w-full rounded-md border p-2"
          >
            <option value="">
              Choose a job...
            </option>

            {jobs.map((job) => (
              <option
                key={job.id}
                value={job.id}
              >
                {job.company} - {job.role}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="text-center">
          Loading questions...
        </div>
      )}

      {/* Interview Section */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3">
              <CardTitle>
                {currentQuestion.question}
              </CardTitle>

              <div className="flex gap-2">
                <Badge variant="secondary">
                  {currentQuestion.category}
                </Badge>

                <Badge variant="outline">
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Speech Recognition */}
            {isSupported ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Voice Recording
                  </h3>

                  <Badge
                    variant={
                      status === "listening"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {status === "listening"
                      ? "Recording..."
                      : "Stopped"}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={
                      handleBeginRecording
                    }
                    disabled={
                      status === "listening"
                    }
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>

                  <Button
                    variant="outline"
                    onClick={
                      handleStopRecording
                    }
                    disabled={
                      status !== "listening"
                    }
                  >
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                </div>

                {transcript && (
                  <div className="rounded-lg border p-4">
                    <p className="mb-2 font-medium">
                      Your Answer:
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {transcript}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border p-4">
                Speech recognition is not
                supported in your browser.
              </div>
            )}

            <Button
              onClick={handleSubmitAnswer}
              disabled={!transcript.trim()}
              className="w-full"
            >
              Submit Answer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Your Answers
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.questionId}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-semibold">
                      Question {index + 1}
                    </p>

                    <p className="text-sm">
                      {result.question}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">
                      Your Answer:
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {result.answer}
                    </p>
                  </div>

                  {result.feedback && (
                    <div>
                      <p className="font-medium">
                        AI Feedback:
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {result.feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex h-16 w-16 flex-col items-center justify-center rounded-full border">
                  <span className="text-xl font-bold">
                    {result.score}
                  </span>

                  <span className="text-xs">
                    Score
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!currentQuestion &&
        selectedJobId &&
        questions.length === 0 &&
        !loading && (
          <Card>
            <CardContent className="pt-6">
              No questions available for this
              job.
            </CardContent>
          </Card>
        )}
    </div>
  );
}