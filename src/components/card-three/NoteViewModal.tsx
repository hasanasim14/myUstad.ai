"use client";

import type React from "react";
import type { Note } from "@/lib/types";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Play, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

type MarkdownComponentProps = {
  children?: React.ReactNode;
};

const NoteViewModal = ({ isOpen, onClose, note }: NoteViewModalProps) => {
  const { theme } = useTheme();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio blob
  const fetchPodcastAudio = async () => {
    if (!note) return;

    setIsLoadingAudio(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/fetch/podcast/${note?.docKey}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("d_tok")}`,
          },
        }
      );

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        setError("Failed to load podcast audio");
      }
    } catch (err) {
      console.error("Error fetching podcast audio:", err);
      setError("Failed to load podcast audio");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // When modal opens with a podcast, fetch audio
  useEffect(() => {
    if (note?.docType === "Podcast" && isOpen) {
      fetchPodcastAudio();
    }

    return () => {
      // Cleanup: pause + revoke blob URL
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setIsPlaying(false);
    };
  }, [note, isOpen]);

  // Attach listeners for play/pause/end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    }
  };

  const renderers = {
    h4: ({ children }: MarkdownComponentProps) => (
      <h4
        className={`font-bold mt-6 mb-2 text-lg ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </h4>
    ),
    h3: ({ children }: MarkdownComponentProps) => (
      <h3
        className={`font-bold mt-6 mb-3 text-xl ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </h3>
    ),
    h2: ({ children }: MarkdownComponentProps) => (
      <h2
        className={`font-bold mt-8 mb-4 text-2xl ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </h2>
    ),
    h1: ({ children }: MarkdownComponentProps) => (
      <h1
        className={`font-bold mt-8 mb-4 text-lg ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </h1>
    ),
    p: ({ children }: MarkdownComponentProps) => (
      <p
        className={`mb-4 leading-relaxed ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {children}
      </p>
    ),
    ul: ({ children }: MarkdownComponentProps) => (
      <ul
        className={`mb-4 ml-6 list-disc space-y-1 ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {children}
      </ul>
    ),
    ol: ({ children }: MarkdownComponentProps) => (
      <ol
        className={`mb-4 ml-6 list-decimal space-y-1 ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {children}
      </ol>
    ),
    li: ({ children }: MarkdownComponentProps) => (
      <li className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
        {children}
      </li>
    ),
    blockquote: ({ children }: MarkdownComponentProps) => (
      <blockquote
        className={`border-l-4 pl-4 italic my-4 ${
          theme === "dark"
            ? "border-gray-600 text-gray-400"
            : "border-gray-300 text-gray-600"
        }`}
      >
        {children}
      </blockquote>
    ),
    code: ({ children }: MarkdownComponentProps) => (
      <code
        className={`px-1 py-0.5 rounded text-sm font-mono ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {children}
      </code>
    ),
    pre: ({ children }: MarkdownComponentProps) => (
      <pre
        className={`p-4 rounded-lg overflow-x-auto mb-4 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {children}
      </pre>
    ),
    strong: ({ children }: MarkdownComponentProps) => (
      <strong
        className={`text-xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </strong>
    ),
  };

  if (!note) return null;

  const processedContent = note?.Response?.replace(/\\n/g, "\n")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^["']|["']$/g, "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold pr-8">
            {note.Title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto pr-4">
          {note.docType === "Podcast" ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {isLoadingAudio ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Loading podcast audio...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center space-y-2">
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    {error}
                  </p>
                  <button
                    onClick={fetchPodcastAudio}
                    className={`px-4 py-2 rounded transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Retry
                  </button>
                </div>
              ) : audioUrl ? (
                <div className="w-full max-w-md space-y-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={togglePlayPause}
                      className={`p-4 rounded-full transition-colors ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </button>
                  </div>

                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
                {processedContent}
              </ReactMarkdown>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NoteViewModal;
