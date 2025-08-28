"use client";

import { useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const AudioOverview = ({ selectedDocs, onLoadingChange }) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const pollingIntervalRef = useRef(null);

  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = sessionStorage.getItem("session_id") || "";
      setSessionId(storedSessionId);
    }
  }, []);

  // this function handles the selection of a language from the dropdown menu
  // it updates the selectedLanguage state and closes the menu
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageMenu(false);
  };

  // this function handles the click event for generating the podcast
  // it sends a POST request to the backend with the selected language and documents

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const pollForPodcast = (key) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/fetch/podcast/${key}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("token")}`,
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
          setLoading(false);
          onLoadingChange?.(false);
          clearPolling();
          localStorage.removeItem("Key");
        } else {
          console.log("Audio not ready yet. Will retry...");
        }
      } catch (err) {
        console.error("Polling error:", err);
        // setError("Failed to fetch podcast audio.");
        clearPolling();
        setLoading(false);
        onLoadingChange?.(false); // Notify parent that podcast generation failed
      }
    }, 30000); // every 30 seconds
  };

  const handleGenerateClick = async () => {
    localStorage.removeItem("Key"); // remove previous session key
    setLoading(true);
    onLoadingChange?.(true); // Notify parent that podcast generation started
    setError(null);
    setAudioUrl(null);
    clearPolling(); // just in case

    try {
      const response = await fetch(`${endpoint}/v1/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
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
    } catch (err) {
      // console.error("Failed to generate podcast:", err);
      // setError(err.message || "Failed to generate podcast");
      setLoading(false);
      onLoadingChange?.(false); // Notify parent that podcast generation failed
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
    <div className="border border-[#3a3a3a] rounded-lg p-3 mb-3">
      <div className="flex justify-between items-center font-semibold mb-1 relative">
        <span className="text-white text-sm">Audio Overview</span>
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

      {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}
    </div>
  );
};

export default AudioOverview;
