"use client";

import React, { useState } from "react";
import { RefreshCcw, Trash2 } from "lucide-react";
import DocChat from "./DocChat";

interface CardTwoProps {
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
    <div className="h-[83vh] md:border md:rounded-lg border-neutral-500  text-white">
      <div className="flex justify-between items-center font-semibold p-2 pb-3 bg-white/5 border-b border-neutral-500 ">
        <span>AI Chat</span>
        <div
          className="flex items-center gap-1 text-[13px] cursor-pointer hover:bg-red-200 hover:text-red-500 rounded-lg p-2 mr-2"
          onClick={handleClear}
        >
          <Trash2 className="mr-2" />
          <span className="text-base">Clear</span>
        </div>
      </div>
      <div className="p-3 h-[calc(100%-60px)] overflow-y-auto">
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
