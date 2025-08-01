"use client";

import BottomNav from "@/components/BottomNav";
import CardOne from "@/components/card-one/CardOne";
import CardThree from "@/components/card-three/CardThree";
import CardTwo from "@/components/card-two/CardTwo";
import LoginForm from "@/components/login/LoginForm";
import Navbar from "@/components/Navbar";
import { Note } from "@/lib/types";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const pathname = usePathname();
  const isMainApp = pathname === "/" || pathname === "/app";

  const [tab, setTab] = useState("content");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isThirdCardCollapsed, setIsThirdCardCollapsed] = useState(false);
  const [isFirstCardCollapsed, setIsFirstCardCollapsed] = useState(false);

  const handleRightCardCollapse = (collapsed: any) => {
    setIsThirdCardCollapsed(collapsed);
  };

  const handleLeftCardCollapse = (collapsed: any) => {
    setIsFirstCardCollapsed(collapsed);
  };

  const handleAddPinnedNote = (question: string, answer: string) => {
    const newNote = {
      title: `Pinned: ${question.slice(0, 30)}...`,
      content: answer,
      editable: false,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const getCardWidths = () => {
    const leftCollapsed = isFirstCardCollapsed;
    const rightCollapsed = isThirdCardCollapsed;

    if (leftCollapsed && rightCollapsed) {
      return {
        cardOne: "basis-[5%]",
        cardTwo: "basis-[90%]",
        cardThree: "basis-[5%]",
      };
    } else if (leftCollapsed) {
      return {
        cardOne: "basis-[5%]",
        cardTwo: "basis-[70%]",
        cardThree: "basis-[25%]",
      };
    } else if (rightCollapsed) {
      return {
        cardOne: "basis-[25%]",
        cardTwo: "basis-[70%]",
        cardThree: "basis-[5%]",
      };
    } else {
      return {
        cardOne: "basis-[25%]",
        cardTwo: "basis-[50%]",
        cardThree: "basis-[25%]",
      };
    }
  };

  const { cardOne, cardTwo, cardThree } = getCardWidths();
  // return <LoginForm />;
  // return (
  //   <div className="hidden md:flex md:flex-1 md:flex-col p-4">
  //     <div className="flex gap-4 w-full">
  //       <div className={`${cardOne} transition-all duration-300 ease-in-out`}>
  //         <CardOne
  //           selectedDocs={selectedDocs}
  //           setSelectedDocs={setSelectedDocs}
  //           onCollapseChange={handleLeftCardCollapse}
  //         />
  //       </div>

  //       <div className={`${cardTwo} transition-all duration-300 ease-in-out`}>
  //         <CardTwo
  //           onPinNote={handleAddPinnedNote}
  //           selectedDocs={selectedDocs}
  //         />
  //       </div>

  //       <div className={`${cardThree} transition-all duration-300 ease-in-out`}>
  //         <CardThree
  //           selectedDocs={selectedDocs}
  //           notes={notes}
  //           setNotes={setNotes}
  //           onCollapseChange={handleRightCardCollapse}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Mobile layout */}
      <div className="flex-1 overflow-y-auto md:hidden">
        {tab === "content" && (
          <CardOne
            selectedDocs={selectedDocs}
            setSelectedDocs={setSelectedDocs}
            onCollapseChange={handleLeftCardCollapse}
          />
        )}
        {tab === "chat" && (
          <CardTwo
            onPinNote={handleAddPinnedNote}
            selectedDocs={selectedDocs}
          />
        )}
        {tab === "library" && (
          <CardThree
            selectedDocs={selectedDocs}
            notes={notes}
            setNotes={setNotes}
            onCollapseChange={handleRightCardCollapse}
          />
        )}
      </div>

      <div className="md:hidden sticky bottom-0 z-10 bg-white">
        <BottomNav currentTab={tab} setTab={setTab} />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-1 md:flex-col p-4">
        <div className="flex gap-4 w-full">
          <div className={`${cardOne} transition-all duration-300 ease-in-out`}>
            <CardOne
              selectedDocs={selectedDocs}
              setSelectedDocs={setSelectedDocs}
              onCollapseChange={handleLeftCardCollapse}
            />
          </div>

          <div className={`${cardTwo} transition-all duration-300 ease-in-out`}>
            <CardTwo
              onPinNote={handleAddPinnedNote}
              selectedDocs={selectedDocs}
            />
          </div>

          <div
            className={`${cardThree} transition-all duration-300 ease-in-out`}
          >
            <CardThree
              selectedDocs={selectedDocs}
              notes={notes}
              setNotes={setNotes}
              onCollapseChange={handleRightCardCollapse}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
