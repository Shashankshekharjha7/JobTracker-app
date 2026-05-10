"use client";

import { useState } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResumeList } from "@/components/ResumeList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResumesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResumeUploaded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleResumeDeleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Management</h1>
        <p className="text-gray-600">Upload and manage your resumes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOCX format (max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeUpload onResumeUploaded={handleResumeUploaded} />
            </CardContent>
          </Card>
        </div>

        {/* Resume List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Resumes</CardTitle>
              <CardDescription>
                Manage your uploaded resumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeList
                key={refreshKey}
                onResumeDeleted={handleResumeDeleted}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}