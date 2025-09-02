"use client";

import BottomNav from "@/components/BottomNav";
import CardOne from "@/components/card-one/CardOne";
import CardThree from "@/components/card-three/CardThree";
import CardTwo from "@/components/card-two/CardTwo";
import MarkdownViewer from "@/components/MarkdownView";
import Navbar from "@/components/Navbar";
import type { Note, SelectedDocs } from "@/lib/types";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const pathname = usePathname();

  const [tab, setTab] = useState("content");
  const [selectedDocs, setSelectedDocs] = useState<SelectedDocs>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isThirdCardCollapsed, setIsThirdCardCollapsed] = useState(false);
  const [isFirstCardCollapsed, setIsFirstCardCollapsed] = useState(false);
  const { theme } = useTheme();

  // 👇 Automatically open/mount a component when pathname is /highlight
  useEffect(() => {
    console.log("the pathname ", pathname);
    if (pathname === "/highlight") {
      setTab("highlight"); // or "chat" or "content" depending on which one you want
    }
  }, [pathname]);

  // eslint-disable-next-line
  const handleRightCardCollapse = (collapsed: any) => {
    setIsThirdCardCollapsed(collapsed);
  };

  // eslint-disable-next-line
  const handleLeftCardCollapse = (collapsed: any) => {
    setIsFirstCardCollapsed(collapsed);
  };

  const handleAddPinnedNote = async (question: string, answer: string) => {
    const newNote = {
      Title: `Pinned: ${question.slice(0, 30)}...`,
      Response: answer,
      editable: false,
    };
    setNotes((prev) => [...prev, newNote]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("d_tok")}`,
        },
        body: JSON.stringify({
          title: newNote?.Title,
          note: newNote?.Response,
          course: localStorage.getItem("course"),
        }),
      });

      if (res.ok) {
        toast.success("Note Pinned!");
      }
    } catch (error) {
      console.error("unable to save the pinned note ", error);
    }
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

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === "dark" ? "bg-[#131313]" : "bg-white"
      }`}
    >
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
        {tab === "highlight" && <MarkdownViewer />}
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
