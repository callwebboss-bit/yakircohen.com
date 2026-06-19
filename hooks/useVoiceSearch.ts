"use client";

import { useCallback, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { resolveVoiceIntent } from "@/lib/voice-search-intents";

type UseVoiceSearchOptions = {
  onNavigate: (href: string, label: string) => void;
  onSearchQuery: (query: string, source: "final" | "interim") => void;
};

export function useVoiceSearch({ onNavigate, onSearchQuery }: UseVoiceSearchOptions) {
  const [liveMessage, setLiveMessage] = useState("");

  const handleFinalTranscript = useCallback(
    (transcript: string) => {
      if (!transcript) return;
      const intent = resolveVoiceIntent(transcript);
      if (intent.type === "navigate") {
        setLiveMessage(`מנווט ל${intent.label}`);
        onNavigate(intent.href, intent.label);
        return;
      }
      onSearchQuery(intent.query, "final");
      setLiveMessage(`מחפש: ${intent.query}`);
    },
    [onNavigate, onSearchQuery],
  );

  const handleInterimTranscript = useCallback(
    (text: string) => {
      onSearchQuery(text, "interim");
    },
    [onSearchQuery],
  );

  const speech = useSpeechRecognition({
    onFinalTranscript: handleFinalTranscript,
    onInterimTranscript: handleInterimTranscript,
  });

  return {
    ...speech,
    liveMessage,
    setLiveMessage,
  };
}
