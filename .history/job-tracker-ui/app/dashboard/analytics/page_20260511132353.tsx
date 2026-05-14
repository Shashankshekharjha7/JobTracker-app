"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  Calendar,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { calculateDaysAgo } from "@/lib/utils";

interface AnalyticsData {
  totalApplications: number;
  thisWeek: number;
  thisMonth: number;
  averageResponseTime: number;
  successRate: number;
  interviewConversionRate: number;
  statusBreakdown: {
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
  };
  timeline: Array<{
    week: string;
    count: number;
  }>;
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [jobsResponse, statsResponse] = await Promise.all([
        api.get("/jobs"),
        api.get("/jobs/stats"),
      ]);

      const jobs = jobsResponse.data;
      const stats = statsResponse.data;

      // Calculate analytics
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = jobs.filter(
        (job: any) => new Date(job.createdAt) >= weekAgo
      ).length;

      const thisMonth = jobs.filter(
        (job: any) => new Date(job.createdAt) >= monthAgo
      ).length;

      const interviewConversionRate =
        stats.applied > 0
          ? Math.round((stats.interview / stats.applied) * 100)
          : 0;

      const successRate =
        stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;

      // Calculate average response time (mock data for now)
      const averageResponseTime = 12;

      // Top companies
      const companyCounts: Record<string, number> = {};
      jobs.forEach((job: any) => {
        companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
      });

      const topCompanies = Object.entries(companyCounts)
        .map(([company, count]) => ({ company, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Weekly timeline (last 8 weeks)
      const timeline: Array<{ week: string; count: number }> = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(
          now.getTime() - (i - 1) * 7 * 24 * 60 * 60 * 1000
        );
        const count = jobs.filter((job: any) => {
          const jobDate = new Date(job.createdAt);
          return jobDate >= weekStart && jobDate < weekEnd;
        }).length;

        timeline.push({
          week: `Week ${8 - i}`,
          count,
        });
      }

      setAnalytics({
        totalApplications: stats.total,
        thisWeek,
        thisMonth,
        averageResponseTime,
        successRate,
        interviewConversionRate,
        statusBreakdown: {
          applied: stats.applied,
          interview: stats.interview,
          offer: stats.offer,
          rejected: stats.rejected,
        },
        timeline,
        topCompanies,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Insights into your job search performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="This Week"
          value={analytics.thisWeek}
          icon={Calendar}
          color="blue"
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Interview Rate"
          value={`${analytics.interviewConversionRate}%`}
          icon={Target}
          color="purple"
        />
        <StatsCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          icon={Award}
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Application Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.timeline.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.week}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.count} applications
                    </span>
                  </div>
                  <Progress
                    value={(item.count / analytics.totalApplications) * 100}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Applied
                  </span>
                  <span className="font-medium text-blue-600">
                    {analytics.statusBreakdown.applied}
                  </span>
                </div>
                <Progress
                  value={
                    (analytics.statusBreakdown.applied /
                      analytics.totalApplications) *
                    100
                  }
                  className="bg-blue-100 dark:bg-blue-900"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Interview
                  </span>
                  <span className="font-medium text-purple-600">
                    {analytics.statusBreakdown.interview}
                  </span>
                </div>
                <Progress
                  value={
                    (analytics.statusBreakdown.interview /
                      analytics.totalApplications) *
                    100
                  }
                  className="bg-purple-100 dark:bg-purple-900"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Offer
                  </span>
                  <span className="font-medium text-green-600">
                    {analytics.statusBreakdown.offer}
                  </span>
                </div>
                <Progress
                  value={
                    (analytics.statusBreakdown.offer /
                      analytics.totalApplications) *
                    100
                  }
                  className="bg-green-100 dark:bg-green-900"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rejected
                  </span>
                  <span className="font-medium text-red-600">
                    {analytics.statusBreakdown.rejected}
                  </span>
                </div>
                <Progress
                  value={
                    (analytics.statusBreakdown.rejected /
                      analytics.totalApplications) *
                    100
                  }
                  className="bg-red-100 dark:bg-red-900"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCompanies.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.company}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count} applications
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                  Average Response Time
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.averageResponseTime} days
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-1">
                  Monthly Growth
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  +{analytics.thisMonth} this month
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
                <p className="text-sm font-medium text-green-900 dark:text-green-200 mb-1">
                  Best Performing Day
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Monday
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}