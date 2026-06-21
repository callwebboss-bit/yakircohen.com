"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechRecognitionStatus =
  | "idle"
  | "listening"
  | "processing"
  | "error"
  | "unsupported";

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: {
    isFinal: boolean;
    [index: number]: { transcript: string };
  };
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionLike, ev: { error: string }) => void) | null;
  onresult: ((this: SpeechRecognitionLike, ev: SpeechRecognitionEventLike) => void) | null;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export function speechErrorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "יש לאשר גישה למיקרופון בדפדפן";
    case "no-speech":
      return "לא זוהה דיבור - נסו שוב";
    case "network":
      return "שגיאת רשת בזיהוי דיבור";
    default:
      return "שגיאה בזיהוי דיבור - נסו שוב";
  }
}

type UseSpeechRecognitionOptions = {
  lang?: string;
  onFinalTranscript?: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
};

export function useSpeechRecognition({
  lang = "he-IL",
  onFinalTranscript,
  onInterimTranscript,
}: UseSpeechRecognitionOptions = {}) {
  const [isSupported] = useState(() => isSpeechRecognitionSupported());
  const [status, setStatus] = useState<SpeechRecognitionStatus>(() =>
    isSpeechRecognitionSupported() ? "idle" : "unsupported",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalRef = useRef(onFinalTranscript);
  const onInterimRef = useRef(onInterimTranscript);

  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
    onInterimRef.current = onInterimTranscript;
  }, [onFinalTranscript, onInterimTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
  }, []);

  const toggleListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || !isSupported) return;

    if (status === "listening") {
      recognitionRef.current?.stop();
      return;
    }

    setErrorMessage(null);

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setStatus("listening");

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) final += text;
        else interim += text;
      }
      if (interim) onInterimRef.current?.(interim);
      if (final) {
        setStatus("processing");
        onFinalRef.current?.(final.trim());
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      setErrorMessage(speechErrorMessage(event.error));
      setStatus("error");
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setStatus((prev) => {
        if (prev === "listening" || prev === "processing") return "idle";
        return prev;
      });
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setErrorMessage("לא ניתן להפעיל זיהוי דיבור");
      setStatus("error");
    }
  }, [isSupported, lang, status]);

  useEffect(() => () => stop(), [stop]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    setStatus((prev) => (prev === "error" ? "idle" : prev));
  }, []);

  return {
    status,
    isSupported,
    isListening: status === "listening",
    errorMessage,
    toggleListening,
    stop,
    clearError,
  };
}
