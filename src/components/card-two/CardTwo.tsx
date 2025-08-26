"use client";

import { useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import DocChat from "./DocChat";

interface CardTwoProps {
  // eslint-disable-next-line
  onPinNote: any;
  selectedDocs: {
    id: number;
    name: string;
    uniqueId: string;
    viewpath: string;
  }[];
}

const CardTwo = ({ onPinNote, selectedDocs }: CardTwoProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleClear = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-[83vh] shadow-2xl md:border md:rounded-xl border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white border-b border-gray-600">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-lg">AI Chat</span>
        </div>
        <button
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20 hover:border-white/30"
          onClick={handleClear}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
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
