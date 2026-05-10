"use client";

import { useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ResumeUploadProps {
  onResumeUploaded: () => void;
}

export function ResumeUpload({
  onResumeUploaded,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      if (
        selectedFile.type !== "application/pdf" &&
        selectedFile.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setError("Only PDF and DOCX files are allowed");
        return;
      }

      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("tags", tags);
    formData.append("isDefault", String(isDefault));

    try {
      await api.post("/resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setFile(null);
      setTags("");
      setIsDefault(false);

      // Clear file input
      const fileInput = document.getElementById(
        "resume-file"
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }

      onResumeUploaded();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            "Failed to upload resume"
        );
      } else {
        setError("Failed to upload resume");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="resume-file">
          Choose File
        </Label>

        <Input
          id="resume-file"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {file && (
          <p className="text-sm text-gray-500">
            Selected: {file.name} (
            {(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">
          Tags (comma-separated)
        </Label>

        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., Software Engineer, Frontend"
          disabled={uploading}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) =>
            setIsDefault(e.target.checked)
          }
          disabled={uploading}
          className="w-4 h-4 rounded border-gray-300"
        />

        <Label
          htmlFor="isDefault"
          className="cursor-pointer"
        >
          Set as default resume
        </Label>
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? (
          "Uploading..."
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </>
        )}
      </Button>
    </div>
  );
}