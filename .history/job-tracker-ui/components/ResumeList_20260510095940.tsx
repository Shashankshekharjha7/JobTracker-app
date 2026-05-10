"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Star } from "lucide-react";

interface Resume {
  id: string;
  filename: string;
  originalName: string;
  tags: string[];
  isDefault: boolean;
  uploadedAt: string;
}

interface ResumeListProps {
  onResumeDeleted: () => void;
}

export function ResumeList({ onResumeDeleted }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/resumes");
      setResumes(response.data);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await api.get(`/resumes/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download resume:", error);
      alert("Failed to download resume");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await api.delete(`/resumes/${id}`);
      fetchResumes();
      onResumeDeleted();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      alert("Failed to delete resume");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/resumes/${id}/default`);
      fetchResumes();
    } catch (error) {
      console.error("Failed to set default:", error);
      alert("Failed to set as default");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No resumes uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900">{resume.originalName}</h3>
              {resume.isDefault && (
                <Badge variant="default" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Default
                </Badge>
              )}
            </div>
            {resume.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {resume.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!resume.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSetDefault(resume.id)}
                title="Set as default"
              >
                <Star className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(resume.id, resume.originalName)}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(resume.id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}