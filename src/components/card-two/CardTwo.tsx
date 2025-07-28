import React, { useState } from "react";
// import DocChat from "./DocChat";
import "./CardTwo.css";
import { RefreshCcw } from "lucide-react";
import DocChat from "./DocChat";

const CardTwo = ({ onPinNote, selectedDocs }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger Chat reset
  };

  return (
    <div className="h-[85vh] md:border md:rounded-lg border-gray-200">
      <div className="card-header">
        <span className="title">AI Chat</span>
        <div
          className="refresh-container hover:bg-gray-200 rounded-lg p-2 mr-2"
          onClick={handleRefresh}
          style={{ cursor: "pointer" }}
        >
          <RefreshCcw className="refresh-icon" />
          <span className="refresh-text">Refresh</span>
        </div>
      </div>
      <div className="card-content">
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
