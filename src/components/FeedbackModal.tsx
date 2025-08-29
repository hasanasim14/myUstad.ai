import { useState } from "react";
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

interface FeedbackType {
  Title: string;
  Message?: string;
  message?: string;
  timestamp?: string;
  id?: string | number;
  keyy?: string | number;
}

export const FeedbackModal = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(
    null
  );
  const [previousFeedbacks, setPreviousFeedbacks] = useState<FeedbackType[]>(
    []
  );
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleFeedbackClick = (feedback: any) => {
    setSelectedFeedback(feedback);
  };

  const handleNewFeedback = () => {
    setSelectedFeedback(null);
    setTitleInput("");
    setFeedbackInput("");
  };

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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="w-[95vw] lg:w-[80vw] xl:w-[100vw] mx-auto bg-white border-0 shadow-2xl p-0 flex flex-col max-h-[92vh]">
        {/* Header */}
        <DialogHeader className="p-5 bg-gradient-to-br from-slate-50 via-gray-50 to-white border-b border-gray-200">
          <DialogTitle className="text-3xl font-semibold text-gray-900 tracking-tight">
            {selectedFeedback ? "View Feedback" : "Share Your Feedback"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            {selectedFeedback
              ? "Review your previous feedback below."
              : "Help us improve myUstad.ai by sharing your thoughts, suggestions, or reporting any issues you've encountered."}
          </DialogDescription>
        </DialogHeader>

        {/* Body (split 50/50) */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
          {/* Left side - Previous Feedbacks */}
          {previousFeedbacks.length > 0 && (
            <div className="basis-1/2 shrink-0 overflow-y-auto border-r border-gray-100 bg-gradient-to-b from-white to-slate-50/50 p-4 pt-0">
              <div className="flex items-center gap-3 mb-5">
                <h4 className="text-m font-semibold text-gray-800">
                  Previous Feedback
                </h4>
                <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
              </div>
              <div className="space-y-4">
                {previousFeedbacks.map((feedback) => (
                  <div
                    key={feedback.keyy || feedback.id}
                    onClick={() => handleFeedbackClick(feedback)}
                    className={`group cursor-pointer rounded-xl p-2 border border-gray-300`}
                  >
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">
                      {feedback.Title}
                    </h5>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {feedback.message}
                    </p>
                    {feedback.timestamp && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {feedback.timestamp}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right side - Feedback Form / View */}
          <div className="basis-1/2 shrink-0 p-4 pt-0 overflow-y-auto">
            <div className="space-y-6">
              {selectedFeedback && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={handleNewFeedback}
                    className="text-sm rounded-lg bg-slate-50 hover:bg-slate-100"
                  >
                    + New Feedback
                  </Button>
                </div>
              )}

              {selectedFeedback ? (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Title
                    </label>
                    <div className="w-full px-5 py-4 border border-gray-200 rounded-xl bg-slate-50 text-gray-900 text-base">
                      {selectedFeedback.Title}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Feedback
                    </label>
                    <div className="w-full px-5 py-4 border border-gray-200 rounded-xl bg-slate-50 text-gray-900 text-base leading-relaxed min-h-[140px]">
                      {selectedFeedback.Message}
                    </div>
                  </div>

                  {selectedFeedback.timestamp && (
                    <p className="flex items-center gap-2 text-sm text-gray-500 pt-2">
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
                      className="block text-m font-semibold text-gray-800 mb-2"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter a title for your feedback..."
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition text-gray-900 placeholder-gray-400 bg-white text-base"
                    />
                  </div>

                  {/* Feedback Input */}
                  <div>
                    <label
                      htmlFor="feedback"
                      className="block text-m font-semibold text-gray-800 mb-2"
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
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition resize-none text-gray-900 placeholder-gray-400 bg-white text-base leading-relaxed"
                      />
                      <span className="absolute bottom-3 right-4 text-xs text-gray-400">
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
        <DialogFooter className="p-4 bg-gradient-to-r from-slate-50 via-gray-50 to-white border-t border-gray-200 flex gap-4 justify-end shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              setOpenDialog(false);
              handleNewFeedback();
            }}
            disabled={feedbackLoading}
          >
            Cancel
          </Button>

          {!selectedFeedback && (
            <Button
              className="bg-black text-white flex items-center gap-2"
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
