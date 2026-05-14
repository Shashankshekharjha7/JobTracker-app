"use client";

import { useState, useRef, useCallback } from "react";

export function useVideoRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Record in 1 second chunks
      setIsRecording(true);
    } catch (err: any) {
      setError(err.message || "Failed to access camera/microphone");
      console.error("Recording error:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    chunksRef.current = [];
    setError(null);
  }, [videoUrl]);

  const downloadVideo = useCallback(() => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `interview-recording-${Date.now()}.webm`;
      a.click();
    }
  }, [videoUrl]);

  return {
    isRecording,
    videoUrl,
    error,
    stream: streamRef.current,
    startRecording,
    stopRecording,
    resetRecording,
    downloadVideo,
  };
}