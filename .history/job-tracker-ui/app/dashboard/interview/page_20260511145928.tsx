"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Briefcase,
  ArrowRight,
  Sparkles,
  Mic,
  Brain,
} from "lucide-react";

interface Job {
  id: string;
  company: string;
  role: string;
}

export default function InterviewPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = () => {
    if (!selectedJobId) return;

    router.push(`/dashboard/interview/${selectedJobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Interview Practice
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Practice interviews with AI-generated questions and real-time
          feedback
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              AI Questions
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart interview questions based on your selected job role.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>

            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              Voice Answering
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Speak naturally and let speech-to-text transcribe your answers.
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              Instant Feedback
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive AI analysis, strengths, and improvement suggestions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Selection */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-2xl">
            Select a Job Role
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Jobs Found
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Add a job application before starting interview practice.
              </p>

              <Button
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Choose a job
                </label>

                <select
                  value={selectedJobId}
                  onChange={(e) =>
                    setSelectedJobId(e.target.value)
                  }
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select a job role...
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
              </div>

              <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-5">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                  Interview Session Includes:
                </h4>

                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li>• 30 minute timed interview</li>
                  <li>• Voice + text answering</li>
                  <li>• Live transcription</li>
                  <li>• AI-generated feedback</li>
                  <li>• Final score and analysis</li>
                </ul>
              </div>

              <Button
                onClick={handleStartInterview}
                disabled={!selectedJobId}
                className="w-full h-12 text-base font-medium"
              >
                Start Interview

                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}