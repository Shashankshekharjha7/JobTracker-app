"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AddJobDialog } from "@/components/AddJobDialog";
import { JobTable } from "@/components/JobTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Briefcase,
  Send,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  appliedDate?: string;
  interviewDate?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const response = await api.get("/jobs/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleJobAdded = () => {
    fetchJobs();
    fetchStats();
  };

  const handleJobDeleted = () => {
    fetchJobs();
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Applied"
          value={stats.applied}
          icon={Send}
          color="purple"
        />
        <StatsCard
          title="Interviews"
          value={stats.interview}
          icon={Calendar}
          color="yellow"
        />
        <StatsCard
          title="Offers"
          value={stats.offer}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Your Applications</CardTitle>
          <AddJobDialog
            onJobAdded={handleJobAdded}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No job applications yet. Start tracking your applications!
              </p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Job
              </button>
            </div>
          ) : (
            <JobTable jobs={jobs} onJobDeleted={handleJobDeleted} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}