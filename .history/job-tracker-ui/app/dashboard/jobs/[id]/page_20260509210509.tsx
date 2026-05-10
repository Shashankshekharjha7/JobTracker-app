"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface Feedback {
  feedback: string;
  analysis?: {
    contentScore?: number;
  };
}

interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  jobDescription?: string;
  extractedSkills: string[];
  interviewQuestions: InterviewQuestion[];
  createdAt: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchJobDetails();
    }
  }, [params?.id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${params.id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!job || !answer.trim()) return;

    const currentQuestion =
      job.interviewQuestions[currentQuestionIndex];

    setSubmitting(true);

    try {
      const response = await api.post(
        `/interviews/questions/${currentQuestion.id}/answer`,
        {
          answer: answer.trim(),
        }
      );

      setFeedback(response.data);
      setAnswer("");

      setTimeout(() => {
        if (
          currentQuestionIndex <
          job.interviewQuestions.length - 1
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setFeedback(null);
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg font-semibold">
          Job not found
        </p>

        <Button
          onClick={() => router.push("/dashboard")}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const currentQuestion =
    job.interviewQuestions[currentQuestionIndex];

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {job.company}
            </CardTitle>

            <p className="text-muted-foreground">
              {job.role}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">
                Status
              </p>

              <Badge>{job.status}</Badge>
            </div>

            {job.location && (
              <div>
                <p className="mb-2 text-sm font-medium">
                  Location
                </p>

                <p>{job.location}</p>
              </div>
            )}

            {job.extractedSkills.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">
                  Required Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.extractedSkills.map(
                    (skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                      >
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {job.jobDescription && (
              <div>
                <p className="mb-2 text-sm font-medium">
                  Description
                </p>

                <p className="text-sm text-muted-foreground">
                  {job.jobDescription.slice(0, 200)}
                  {job.jobDescription.length > 200
                    ? "..."
                    : ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interview Practice */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Interview Practice
              </CardTitle>

              {job.interviewQuestions.length > 0 && (
                <Badge variant="outline">
                  Question{" "}
                  {currentQuestionIndex + 1} of{" "}
                  {job.interviewQuestions.length}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {job.interviewQuestions.length === 0 ? (
              <div className="space-y-2">
                <p>
                  No interview questions available yet.
                </p>

                <p className="text-sm text-muted-foreground">
                  Add a job description to generate
                  AI-powered questions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {currentQuestion.category}
                    </Badge>

                    <Badge variant="outline">
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold">
                    {currentQuestion.question}
                  </h3>
                </div>

                <Textarea
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  placeholder="Type your answer here..."
                  rows={6}
                  disabled={submitting}
                />

                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    submitting || !answer.trim()
                  }
                  className="w-full"
                >
                  {submitting
                    ? "Analyzing..."
                    : "Submit Answer"}
                </Button>

                {feedback && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <p className="font-semibold">
                          Score:{" "}
                          {feedback.analysis
                            ?.contentScore || 0}
                          /100
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {feedback.feedback}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.max(0, prev - 1)
                      )
                    }
                    disabled={
                      currentQuestionIndex === 0
                    }
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(
                          job.interviewQuestions
                            .length - 1,
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentQuestionIndex ===
                      job.interviewQuestions
                        .length -
                        1
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}