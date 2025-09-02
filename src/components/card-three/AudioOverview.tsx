"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { SelectedDocs } from "@/lib/types";

interface AudioOverviewProps {
  selectedDocs: SelectedDocs;
  onLoadingChange: (loading: boolean) => void;
  onPodcastGenerated?: (url: string) => void;
}

const AudioOverview = ({
  selectedDocs,
  onLoadingChange,
  onPodcastGenerated,
}: AudioOverviewProps) => {
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const { theme } = useTheme();
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = sessionStorage.getItem("session_id") || "";
      setSessionId(storedSessionId);
    }
  }, []);

  // Polling method
  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const pollForPodcast = (key: string) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/fetch/podcast/${key}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("d_tok")}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`Polling failed: ${response.statusText}`);

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("audio")) {
          const blob = await response.blob();
          const audioObjectUrl = URL.createObjectURL(blob);
          onPodcastGenerated?.(audioObjectUrl);
          onLoadingChange?.(false);
          clearPolling();
          localStorage.removeItem("Key");
        } else {
          console.log("Audio not ready yet. Will retry...");
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearPolling();
        // Notify parent that podcast generation failed
        onLoadingChange?.(false);
      }
    }, 30000); // every 30 seconds
  };

  const handleGenerateClick = async () => {
    localStorage.removeItem("Key");
    onLoadingChange?.(true);
    setError(null);
    clearPolling();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/podcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("d_tok")}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            language: localStorage.getItem("lang"),
            selectedDocs,
          }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      const key = data?.data;
      if (!key) throw new Error("Invalid response from server.");

      localStorage.setItem("Key", key);
      pollForPodcast(key);
    } catch (err) {
      console.error("Error generating podcast ", err);
      onLoadingChange?.(false);
    }
  };

  useEffect(() => {
    const key = localStorage.getItem("Key");
    if (key) {
      pollForPodcast(key);
    }

    return () => clearPolling();
  }, []);

  return (
    <div
      className={`border rounded-lg p-3 mb-3 ${
        theme === "dark" ? "border-[#3a3a3a]" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center font-semibold mb-1 relative">
        <span
          className={`text-sm ${
            theme === "dark" ? "text-white" : "text-gray-700"
          }`}
        >
          Audio Overview
        </span>
      </div>

      <div className="load-box">
        <Button
          className="flex items-center justify-center bg-[#3b82f6] text-white rounded-md p-2 text-sm font-semibold cursor-pointer hover:bg-[#2563eb] w-full"
          onClick={handleGenerateClick}
          disabled={selectedDocs.length === 0}
        >
          Generate
        </Button>
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AudioOverview;
