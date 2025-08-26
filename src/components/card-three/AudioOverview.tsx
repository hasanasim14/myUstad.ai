"use client";

import React, { useEffect, useRef, useState } from "react";
import {  Languages } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// eslint-disable-next-line
const AudioOverview = ({ selectedDocs }: any) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];

  // store the session ID if found
  useEffect(() => {
    const id = sessionStorage.getItem("session_id");
    if (id) {
      setSessionId(id);
    }
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setShowLanguageMenu(false);
  };

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
          `${process.env.NEXT_PUBLIC_API_URL}/fetch/podcast/${key}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`Polling failed: ${response.statusText}`);

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("audio")) {
          const blob = await response.blob();
          const audioObjectUrl = URL.createObjectURL(blob);
          setAudioUrl(audioObjectUrl);
          setLoading(false);
          clearPolling();
          localStorage.removeItem("Key");
        } else {
          console.log("Audio not ready yet. Will retry...");
        }
      } catch (error) {
        console.error("Polling error:", error);
        setError("Failed to fetch podcast audio.");
        clearPolling();
        setLoading(false);
      }
    }, 30000);
  };

  const handleGenerateClick = async () => {
    localStorage.removeItem("Key");
    setLoading(true);
    setError("");
    setAudioUrl(null);
    clearPolling();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/podcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            language: selectedLanguage,
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
    } catch (error) {
      console.error("Failed to generate podcast:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const key = localStorage.getItem("Key");
    if (key) {
      setLoading(true);
      pollForPodcast(key);
    }

    return () => clearPolling();
  }, []);

  return (
    <div className="border border-[#e0e0e0] rounded-lg p-3 mb-3">
      <div className="flex justify-between items-center font-semibold mb-[10px] relative">
        <span className="text-sm">Audio Overview</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-gray-200 rounded-full"
            >
              <Languages className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="p-2 w-32 bg-[#1f1f1f] text-white border-gray-800"
          >
            <div className="mb-1 text-[10px] font-normal">Select Language:</div>
            {languages.map((lang) => (
              <div
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={`cursor-pointer text-[9px] py-[2px] ${
                  lang === selectedLanguage
                    ? "font-bold text-blue-500"
                    : "font-normal text-gray-700"
                }`}
              >
                {lang}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-row flex-nowrap items-center justify-between gap-3 mt-3 w-full">
        <Button
          className="bg-[#4259ff] text-white rounded-lg font-semibold hover:bg-[#3a4bda] w-full"
          onClick={handleGenerateClick}
          disabled={loading || selectedDocs.length === 0}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="border-[4px] border-[#f3f3f3] border-t-[#7d868c] rounded-full w-[clamp(14px,2vw,18px)] h-[clamp(14px,2vw,18px)] animate-spin" />
              <span className="ml-2">Generating</span>
            </div>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {error && <div className="color-red-500 mt-2">{error}</div>}

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioOverview;
