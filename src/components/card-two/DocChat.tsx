"use client";

import { useState, useEffect, useRef } from "react";
import type { SelectedDocs } from "@/lib/types";
import {
  Pin,
  Headphones,
  Mic,
  SendHorizonal,
  Copy,
  User,
  Bot,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "../ui/input";
import ReactMarkdown from "react-markdown";

interface DocChatProps {
  selectedDocs: SelectedDocs;
  refreshTrigger: number;
  onPinNote: (question: string, answer: string) => void;
}

// bot message initially
const initialBotMessage = {
  from: "bot",
  text: "Hi there! I'm StudyBot, your AI study assistant. How can I help you today?",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

const DocChat = ({ selectedDocs, refreshTrigger, onPinNote }: DocChatProps) => {
  const [messages, setMessages] = useState([initialBotMessage]);
  const [input, setInput] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [audioAbortController, setAudioAbortController] =
    useState<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setMessages([initialBotMessage]);
  }, [refreshTrigger]);

  // eslint-disable-next-line
  const playNoteAudioFromAPI = async (text: string, index: any) => {
    setClickedIndex(index);

    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingIndex(null);
      setClickedIndex(null);
      return;
    }

    if (audioAbortController) {
      audioAbortController.abort();
      setAudioAbortController(null);
    }

    const controller = new AbortController();
    setAudioAbortController(controller);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/generate-audio/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        }
      );

      if (controller.signal.aborted) {
        setClickedIndex(null);
        setAudioAbortController(null);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setPlayingIndex(index);
        setClickedIndex(null);
        setAudioAbortController(null);
      };

      audio.onended = () => {
        setPlayingIndex(null);
        setClickedIndex(null);
      };

      await audio.play();
    } catch (error) {
      setPlayingIndex(null);
      setClickedIndex(null);
      setAudioAbortController(null);
      console.error("the error", error);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/transcribe`,
              {
                method: "POST",
                body: formData,
              }
            );

            const data = await response.json();
            setInput(data.transcription);
          } catch (error) {
            console.error("Transcription failed:", error);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied or not available", err);
      }
    }
  };

  // eslint-disable-next-line
  const sendMessage = async (customInput?: any) => {
    const userInput = customInput || input;
    if (!userInput.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = { from: "user", text: userInput, time };
    const loadingMessage = {
      from: "bot",
      text: (
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      ),
      time: "",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");

    try {
      const conversationHistory = [];
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.from === "user" && messages[i + 1]?.from === "bot") {
          conversationHistory.push({
            question: msg.text,
            answer: messages[i + 1].text,
          });
          i++;
        }
      }

      conversationHistory.push({
        question: userInput,
        answer: null,
      });

      const sessionId = sessionStorage.getItem("session_id") || "";

      const payload = {
        question: userInput,
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        conversation: conversationHistory,
      };
      const filterpayload = {
        question: payload.question,
        timestamp: payload.timestamp,
        conversation: payload.conversation,
        session_id: sessionId,
        selectedDocs: selectedDocs,
      };

      let response;
      if (!selectedDocs || selectedDocs.length === 0) {
        response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("d_tok")}`,
          },
          body: JSON.stringify({
            ...payload,
            course: localStorage.getItem("course"),
          }),
        });
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/query_with_filter`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filterpayload),
          }
        );
      }

      const data = await response.json();

      if (data.session_id) {
        sessionStorage.setItem("session_id", data.session_id);
      }

      const botReply =
        data?.reply || "Thanks for your message! I am working on it.";
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { from: "bot", text: botReply, time: botTime }];
      });
    } catch (error) {
      console.error("API error:", error);
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          {
            from: "bot",
            text: "Sorry, something went wrong while processing your question.",
            time: botTime,
          },
        ];
      });
    }
  };

  const handleCopyMessage = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(typeof text === "string" ? text : "");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div
      className={`flex flex-col h-full ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              msg.from === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex-shrink-0">
              {msg.from === "user" ? (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
                  <User size={20} className="text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-400/20">
                  <Bot size={20} className="text-white" />
                </div>
              )}
            </div>

            <div
              className={`flex flex-col max-w-[75%] ${
                msg.from === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-lg ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-md shadow-blue-600/20"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-100 border border-gray-600 rounded-bl-md shadow-gray-900/50"
                    : "bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md shadow-gray-200/50"
                }`}
              >
                {typeof msg.text === "string" ? (
                  <ReactMarkdown
                    components={{
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline hover:text-blue-300"
                        />
                      ),
                      p: ({ ...props }) => (
                        <p {...props} className="mb-2 last:mb-0" />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>

              <div
                className={`mt-2 flex items-center gap-3 ${
                  msg.from === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </span>

                {msg.from === "bot" &&
                  msg.text !== initialBotMessage.text &&
                  typeof msg.text === "string" && (
                    <div className="flex items-center gap-2">
                      <button
                        className={`p-1.5 rounded-full transition-colors duration-200 group ${
                          theme === "dark"
                            ? "hover:bg-gray-600"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          const userQuestion =
                            messages[index - 1]?.from === "user"
                              ? messages[index - 1].text
                              : "Unknown Question";
                          const botAnswer =
                            typeof msg.text === "string" ? msg.text : "";
                          onPinNote(userQuestion, botAnswer);
                        }}
                        title="Pin this message"
                      >
                        <Pin
                          size={14}
                          className={`transition-colors group-hover:text-blue-400 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      </button>

                      <button
                        className={`p-1.5 rounded-full transition-colors duration-200 group ${
                          theme === "dark"
                            ? "hover:bg-gray-600"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() => playNoteAudioFromAPI(msg.text, index)}
                        title={
                          playingIndex === index
                            ? "Stop audio"
                            : clickedIndex === index
                            ? "Stop generating audio"
                            : "Play audio"
                        }
                      >
                        {playingIndex === index ? (
                          <VolumeX size={14} className="text-emerald-400" />
                        ) : clickedIndex === index ? (
                          <Volume2 size={14} className="text-red-400" />
                        ) : (
                          <Headphones
                            size={14}
                            className={`transition-colors group-hover:text-emerald-400 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                        )}
                      </button>

                      <button
                        className={`p-1.5 rounded-full transition-colors duration-200 group ${
                          theme === "dark"
                            ? "hover:bg-gray-600"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() => handleCopyMessage(msg.text, index)}
                        title={
                          copiedIndex === index ? "Copied!" : "Copy message"
                        }
                      >
                        {copiedIndex === index ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy
                            size={14}
                            className={`transition-colors group-hover:text-blue-400 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`flex items-center gap-3 max-w-4xl mx-auto w-full px-4 py-2 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Input
          type="text"
          value={input}
          className={`flex-1 p-2 shadow-inner ${
            theme === "dark"
              ? "border-[#3a3a3a] focus:border-blue-500 focus:ring-blue-500/20 text-gray-100 placeholder-gray-400 bg-gray-800"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900 placeholder-gray-500 bg-white"
          }`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type your message..."
        />

        <button
          className={`p-2 cursor-pointer transition-all duration-200 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 rounded-full"
              : theme === "dark"
              ? "text-gray-300 hover:text-gray-100"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={toggleRecording}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <Mic className="w-6 h-6" />
        </button>

        <button
          className={`p-2 rounded-xl transition-all duration-200 ${
            input.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
              : theme === "dark"
              ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-900"
              : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
          }`}
          onClick={() => sendMessage()}
          disabled={!input.trim()}
          title="Send message"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DocChat;
