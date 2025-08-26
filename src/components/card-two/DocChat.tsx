"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Input } from "../ui/input";
import ReactMarkdown from "react-markdown";

interface DocChatProps {
  // eslint-disable-next-line
  selectedDocs: any;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-audio/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setPlayingIndex(index);
        setClickedIndex(null);
      };

      audio.onended = () => {
        setPlayingIndex(null);
        setClickedIndex(null);
      };

      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
      setPlayingIndex(null);
      setClickedIndex(null);
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
          <span className="text-gray-500 text-sm ml-2">Thinking...</span>
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
        session_id: "5e8e8e1e-428c-48d9-826b-709efda170d7",
        conversation: conversationHistory,
      };
      const filterpayload = {
        question: payload.question,
        timestamp: payload.timestamp,
        conversation: payload.conversation,
        session_id: "5e8e8e1e-428c-48d9-826b-709efda170d7",
        selectedDocs: selectedDocs,
      };

      let response;
      if (!selectedDocs || selectedDocs.length === 0) {
        response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6s">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              msg.from === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
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

            {/* Message Content */}
            <div
              className={`flex flex-col max-w-[75%] ${
                msg.from === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl shadow-lg ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-md shadow-blue-600/20"
                    : "bg-gray-700 text-gray-100 border border-gray-600 rounded-bl-md shadow-gray-900/50"
                }`}
              >
                {typeof msg.text === "string" ? (
                  <ReactMarkdown
                    // className="prose prose-sm max-w-none prose-invert"
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline hover:text-blue-300"
                        />
                      ),
                      p: ({ node, ...props }) => (
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

              {/* Timestamp and Actions */}
              <div
                className={`mt-2 flex items-center gap-3 ${
                  msg.from === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-xs text-gray-400">{msg.time}</span>

                {msg.from === "bot" && msg.text !== initialBotMessage.text && (
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-600 transition-colors duration-200 group"
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
                        className="text-gray-400 group-hover:text-blue-400 transition-colors"
                      />
                    </button>

                    <button
                      className="p-1.5 rounded-full hover:bg-gray-600 transition-colors duration-200 group"
                      onClick={() => playNoteAudioFromAPI(msg.text, index)}
                      title={
                        playingIndex === index ? "Stop audio" : "Play audio"
                      }
                    >
                      {playingIndex === index ? (
                        <VolumeX size={14} className="text-emerald-400" />
                      ) : clickedIndex === index ? (
                        <Volume2 size={14} className="text-red-400" />
                      ) : (
                        <Headphones
                          size={14}
                          className="text-gray-400 group-hover:text-emerald-400 transition-colors"
                        />
                      )}
                    </button>

                    <button
                      className="p-1.5 rounded-full hover:bg-gray-600 transition-colors duration-200 group"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          typeof msg.text === "string" ? msg.text : ""
                        )
                      }
                      title="Copy message"
                    >
                      <Copy
                        size={14}
                        className="text-gray-400 group-hover:text-blue-400 transition-colors"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      {/* <div className="border-t border-gray-600 p-4"> */}
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={input}
              className="w-full p-2 pr-12 border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 text-gray-100 placeholder-gray-400 shadow-inner"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
            />
          </div>

          <button
            className={`p-2 rounded-xl transition-all duration-200 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
            }`}
            onClick={toggleRecording}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            className={`p-2 rounded-xl transition-all duration-200 ${
              input.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                : "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
            }`}
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            title="Send message"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      {/* </div>ss */}
    </div>
  );
};

export default DocChat;
