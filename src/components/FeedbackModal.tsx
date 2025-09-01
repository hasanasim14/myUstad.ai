"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface FeedbackType {
  Title: string;
  Message?: string;
  message?: string;
  timestamp?: string;
  id?: string | number;
  keyy?: string | number;
}

interface FeedbackModalProps {
  open: boolean;
  onCancel: () => void;
}

export const FeedbackModal = ({ open, onCancel }: FeedbackModalProps) => {
  const [titleInput, setTitleInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(
    null
  );
  const [previousFeedbacks, setPreviousFeedbacks] = useState<FeedbackType[]>(
    []
  );
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleFeedbackClick = (feedback: FeedbackType) => {
    setSelectedFeedback(feedback);
  };

  const handleNewFeedback = () => {
    setSelectedFeedback(null);
    setTitleInput("");
    setFeedbackInput("");
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("d_tok")}`,
            },
          }
        );

        const data = await res.json();
        setPreviousFeedbacks(data?.data || []);
      } catch (error) {
        console.error("Error fetching feedbacks = ", error);
      }
    };
    fetchFeedback();
  }, []);

  const handleSendFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("d_tok")}`,
        },
        body: JSON.stringify({
          title: titleInput.trim(),
          message: feedbackInput.trim(),
        }),
      });

      const data = await res.json();
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setFeedbackLoading(false);
    }

    if (feedbackInput.trim() && titleInput.trim()) {
      const newFeedback = {
        Title: titleInput.trim(),
      };
      setPreviousFeedbacks([newFeedback, ...previousFeedbacks]);
      setTitleInput("");
      setFeedbackInput("");
      setSelectedFeedback(null);
      toast.success("Feedback submitted successfully!");
    } else {
      toast.error("Please fill in both title and feedback");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className={`w-[80vw] max-w-[80vw] mx-auto ${
          isDark ? "bg-[#0a0a0a] border-[#3a3a3a]" : "bg-white border-gray-200"
        } shadow-2xl p-0 flex flex-col max-h-[92vh] [&>button]:hidden`}
      >
        {/* Header */}
        <DialogHeader
          className={`p-5 ${
            isDark
              ? "bg-[#0a0a0a] border-[#3a3a3a]"
              : "bg-gradient-to-br from-slate-50 via-gray-50 to-white border-gray-200"
          } border-b rounded-t-xl`}
        >
          <DialogTitle
            className={`text-2xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            } tracking-tight`}
          >
            {selectedFeedback ? "View Feedback" : "Share Your Feedback"}
          </DialogTitle>
          <DialogDescription
            className={`${
              isDark ? "text-gray-300" : "text-gray-600"
            } text-sm leading-relaxed max-w-2xl`}
          >
            {selectedFeedback
              ? "Review your previous feedback below."
              : "Help us improve myUstad.ai by sharing your thoughts, suggestions, or reporting any issues you've encountered."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
          {/* Left side - Previous Feedbacks */}
          {previousFeedbacks.length > 0 && (
            <div
              className={`basis-1/2 shrink-0 overflow-y-auto ${
                isDark
                  ? "bg-[#0a0a0a] border-[#3a3a3a]"
                  : "border-gray-100 bg-gradient-to-b from-white to-slate-50/50"
              } border-r p-4 pt-0`}
            >
              <div className="flex items-center gap-3 mb-5">
                <h4
                  className={`text-m font-semibold ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Previous Feedback
                </h4>
                <div
                  className={`h-px ${
                    isDark
                      ? "bg-gradient-to-r from-gray-600 to-transparent"
                      : "bg-gradient-to-r from-gray-200 to-transparent"
                  } flex-1`}
                ></div>
              </div>
              <div className="space-y-4">
                {previousFeedbacks.map((feedback) => (
                  <div
                    key={feedback.keyy || feedback.id}
                    onClick={() => handleFeedbackClick(feedback)}
                    className={`group cursor-pointer rounded-xl p-2 border ${
                      isDark
                        ? "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <h5
                      className={`font-semibold text-sm ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      } mb-2`}
                    >
                      {feedback.Title}
                    </h5>
                    <p
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } text-sm line-clamp-2 leading-relaxed`}
                    >
                      {feedback.message}
                    </p>
                    {feedback.timestamp && (
                      <div
                        className={`flex items-center gap-2 mt-3 text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {feedback.timestamp}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="basis-1/2 shrink-0 p-4 pt-0 overflow-y-auto">
            <div className="space-y-6">
              {selectedFeedback && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={handleNewFeedback}
                    className={`text-sm rounded-lg ${
                      isDark
                        ? "bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-slate-50 hover:bg-slate-100 border-gray-300 text-gray-700"
                    }`}
                  >
                    + New Feedback
                  </Button>
                </div>
              )}

              {selectedFeedback ? (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label
                      className={`block text-lg font-semibold ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      } mb-2`}
                    >
                      Title
                    </label>
                    <div
                      className={`w-full px-5 py-4 border rounded-xl text-base ${
                        isDark
                          ? "border-gray-600 bg-gray-800 text-gray-100"
                          : "border-gray-200 bg-slate-50 text-gray-900"
                      }`}
                    >
                      {selectedFeedback.Title}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label
                      className={`block text-lg font-semibold ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      } mb-2`}
                    >
                      Feedback
                    </label>
                    <div
                      className={`w-full px-5 py-4 border rounded-xl text-base leading-relaxed min-h-[140px] ${
                        isDark
                          ? "border-gray-600 bg-gray-800 text-gray-100"
                          : "border-gray-200 bg-slate-50 text-gray-900"
                      }`}
                    >
                      {selectedFeedback.Message}
                    </div>
                  </div>

                  {selectedFeedback.timestamp && (
                    <p
                      className={`flex items-center gap-2 text-sm pt-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      Submitted {selectedFeedback.timestamp}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label
                      htmlFor="title"
                      className={`block text-m font-semibold ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      } mb-2`}
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter a title for your feedback..."
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-4 transition text-base ${
                        isDark
                          ? "border-gray-600 focus:ring-blue-900/50 focus:border-blue-400 bg-gray-800 text-gray-100 placeholder-gray-500"
                          : "border-gray-300 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  {/* Feedback Input */}
                  <div>
                    <label
                      htmlFor="feedback"
                      className={`block text-m font-semibold ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      } mb-2`}
                    >
                      Your feedback
                    </label>
                    <div className="relative">
                      <textarea
                        id="feedback"
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-4 transition resize-none text-base leading-relaxed ${
                          isDark
                            ? "border-gray-600 focus:ring-blue-900/50 focus:border-blue-400 bg-gray-800 text-gray-100 placeholder-gray-500"
                            : "border-gray-300 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-900 placeholder-gray-400"
                        }`}
                      />
                      <span
                        className={`absolute bottom-3 right-4 text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {feedbackInput.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - pinned at bottom */}
        <DialogFooter
          className={`p-4 border-t flex gap-4 justify-end rounded-b-xl shrink-0 ${
            isDark
              ? "bg-[#0a0a0a] border-[#3a3a3a]"
              : "bg-gradient-to-r from-slate-50 via-gray-50 to-white border-gray-200"
          }`}
        >
          <Button
            variant="outline"
            onClick={() => onCancel()}
            disabled={feedbackLoading}
            className={
              isDark ? "border-gray-600 text-gray-200 hover:bg-gray-700" : ""
            }
          >
            Cancel
          </Button>

          {!selectedFeedback && (
            <Button
              className={`flex items-center gap-2 ${
                isDark
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
              onClick={handleSendFeedback}
              disabled={
                feedbackLoading || !titleInput.trim() || !feedbackInput.trim()
              }
            >
              {feedbackLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                "Send Feedback"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
