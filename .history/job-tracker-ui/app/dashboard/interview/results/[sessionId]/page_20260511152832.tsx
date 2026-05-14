"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  CheckCircle,
  ArrowLeft,
  Trophy,
  MessageSquare,
} from "lucide-react";

interface Result {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResults = localStorage.getItem(
      `interview-results-${params.sessionId}`
    );

    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }

    setLoading(false);
  }, [params.sessionId]);

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((acc, curr) => acc + curr.score, 0) /
            results.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <Card className="border-none bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Interview Results
              </h1>

              <p className="text-blue-100">
                Here is your interview performance summary
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-28 w-28 rounded-full bg-white/20 flex flex-col items-center justify-center border border-white/30">
                <Trophy className="w-8 h-8 mb-1" />

                <span className="text-3xl font-bold">
                  {averageScore}
                </span>

                <span className="text-sm">
                  Avg Score
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result, index) => (
            <Card
              key={index}
              className="shadow-md border border-gray-200 dark:border-zinc-800"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      Question {index + 1}
                    </CardTitle>

                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {result.question}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center h-24 w-24 rounded-full border-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <span className="text-2xl font-bold text-blue-600">
                      {result.score}
                    </span>

                    <span className="text-xs text-gray-500">
                      Score
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Performance</span>

                    <span>{result.score}%</span>
                  </div>

                  <Progress value={result.score} />
                </div>

                {/* User Answer */}
                <div className="rounded-xl border p-4 bg-gray-50 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />

                    <h3 className="font-semibold">
                      Your Answer
                    </h3>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {result.answer}
                  </p>
                </div>

                {/* Feedback */}
                <div className="rounded-xl border p-4 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />

                    <h3 className="font-semibold text-green-700 dark:text-green-400">
                      AI Feedback
                    </h3>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300">
                    {result.feedback}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-gray-500">
              No interview results found.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            router.push("/dashboard/interview")
          }
        >
          Back to Interviews
        </Button>

        <Button
          className="flex-1"
          onClick={() =>
            router.push("/dashboard")
          }
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}