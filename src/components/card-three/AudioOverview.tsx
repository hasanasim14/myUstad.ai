"use client";

import React, { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

const AudioOverview = ({ selectedDocs }: any) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];
  const sessionId = sessionStorage.getItem("session_id") || "";

  // eslint-disable-next-line
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
        const response = await fetch(`${endpoint}/fetch/podcast/${key}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
      const response = await fetch(`${endpoint}/v1/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          language: selectedLanguage,
          selectedDocs,
        }),
      });

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
    <div className="audio-overview">
      <div className="audio-header" style={{ position: "relative" }}>
        <span className="audio-title" style={{ fontSize: "13px" }}>
          Audio Overview
        </span>
        <Info
          className="info-icon"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          style={{ cursor: "pointer" }}
        />
        {showLanguageMenu && (
          <div className="absolute top-full right-0 bg-white border border-[#ccc] p-2 z-[100] rounded shadow-[#00000026]">
            <div className="mb-1 font-normal text-[10px]">Select Language:</div>
            {languages.map((lang) => (
              <div
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={`cursor-pointer py-1 text-[9px] ${
                  lang === selectedLanguage
                    ? "font-bold text-[#007bff]"
                    : "font-normal"
                }`}
              >
                {lang}

                {lang}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="load-box">
        <span className="load-text" style={{ fontSize: "11px" }}>
          Click to generate the podcast.
        </span>
        <button
          className="flex items-center justify-center bg-[#4259ff] text-white rounded-xl p-2 text-sm font-semibold cursor-pointer hover:bg-[#3a4bda] w-full"
          onClick={handleGenerateClick}
          disabled={loading || selectedDocs.length === 0}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}

      {audioUrl && (
        <div style={{ marginTop: "16px" }}>
          <audio controls src={audioUrl} style={{ width: "100%" }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioOverview;
