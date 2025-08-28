"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
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
    <div className="h-[85vh] shadow-2xl md:border md:rounded-xl border-[#3a3a3a] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-3 text-white border-b border-[#3a3a3a]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-md">AI Chat</span>
        </div>
        <Button
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20 hover:border-white/30"
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
