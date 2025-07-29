"use client";

import React, { useState } from "react";
import { RefreshCcw } from "lucide-react";
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

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-[85vh] md:border md:rounded-lg border-gray-200">
      <div className="flex justify-between items-center font-semibold border-b-[1.5px] border-slate-200 m-0 rounded-t-[10px] text-[#222222] h-[60px] bg-[#f8fafc]">
        <span>AI Chat</span>
        <div
          className="flex items-center gap-1 text-[13px] text-slate-500 cursor-pointer hover:bg-gray-200 rounded-lg p-2 mr-2"
          onClick={handleRefresh}
          style={{ cursor: "pointer" }}
        >
          <RefreshCcw className="text-[17px] pr-[5px]" />
          <span className="text-[14px] text-slate-500 cursor-pointer">
            Refresh
          </span>
        </div>
      </div>
      <div className="p-[5px] h-[calc(100%-60px)] overflow-y-auto">
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
