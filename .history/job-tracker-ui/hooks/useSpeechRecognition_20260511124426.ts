"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type SpeechStatus = "idle" | "listening" | "stopped" | "unsupported";

type UseSpeechRecognitionReturn = {
  transcript: string;
  status: SpeechStatus;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
};

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

function checkSupport(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("");
  const isSupported = checkSupport();
  const [status, setStatus] = useState<SpeechStatus>(
    isSupported ? "idle" : "unsupported"
  );

  const isListeningRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (
      (window as Window & { SpeechRecognition?: SpeechRecognitionConstructor })
        .SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .webkitSpeechRecognition
    ) as SpeechRecognitionConstructor;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => (prev + finalTranscript).trimStart());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      if (event.error === "aborted") return;
      
      console.error("Speech recognition error:", event.error);
      isListeningRef.current = false;
      setStatus("stopped");
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (_) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      recognition.abort();
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListeningRef.current) {
      console.log("Already listening, skipping start");
      return;
    }

    try {
      isListeningRef.current = true;
      recognitionRef.current.start();
      setStatus("listening");
    } catch (err) {
      console.error("Failed to start recognition:", err);
      isListeningRef.current = false;
      setStatus("stopped");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (!isListeningRef.current) {
      return;
    }

    try {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setStatus("stopped");
    } catch (err) {
      console.error("Failed to stop recognition:", err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setTranscript("");
    setStatus("idle");
  }, []);

  return {
    transcript,
    status,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
}