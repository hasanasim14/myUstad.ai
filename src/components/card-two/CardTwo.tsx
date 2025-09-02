"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { SelectedDocs } from "@/lib/types";
import DocChat from "./DocChat";

interface CardTwoProps {
  // eslint-disable-next-line
  onPinNote: any;
  selectedDocs: SelectedDocs;
}

const CardTwo = ({ onPinNote, selectedDocs }: CardTwoProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { theme } = useTheme();

  const handleClear = () => {
    localStorage.removeItem("session_id");
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div
      className={`h-[85vh] shadow-xl md:border md:rounded-xl overflow-hidden ${
        theme === "dark"
          ? "border-[#3a3a3a] bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center p-3 border-b ${
          theme === "dark"
            ? "text-white border-[#3a3a3a] bg-gray-800"
            : "text-gray-900 border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-md">AI Chat</span>
        </div>
        <Button
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors duration-200 border ${
            theme === "dark"
              ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white"
              : "bg-gray-100 hover:bg-gray-200 border-gray-300 hover:border-gray-400 text-gray-700"
          }`}
          onClick={handleClear}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </Button>
      </div>

      {/* Chat Content */}
      <div className="h-[calc(100%-80px)]">
        <DocChat
          refreshTrigger={refreshTrigger}
          onPinNote={onPinNote}
          selectedDocs={selectedDocs}
        />
      </div>
    </div>
  );
};

export default CardTwo;
