"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Headphones,
  MessageSquareText,
  Network,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import MindmapModal from "./MindmapModal";
import AudioOverview from "./AudioOverview";
import NoteViewModal from "./NoteViewModal";
import NoteEditModal from "./NoteEditModal";

interface CardThreeProps {
  notes: Array<{
    title: string;
    content: string;
    editable?: boolean;
    type?: string;
  }>;
  setNotes: any;
  selectedDocs: any;
  onCollapseChange?: (collapsed: boolean) => void;
}

type MarkdownComponentProps = {
  children?: React.ReactNode;
};

const CardThree = ({
  notes,
  setNotes,
  selectedDocs,
  onCollapseChange,
}: CardThreeProps) => {
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNoteIndex, setCurrentEditNoteIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewNote, setCurrentViewNote] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRef = useRef(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef(null);

  const noteTypes = [
    { label: "Study Guide", icon: GraduationCap },
    { label: "Briefing Doc", icon: FileText },
    { label: "FAQ", icon: MessageSquareText },
    { label: "Mind Map", icon: Network },
  ];

  const fetchMindmap = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-mindmap`,
        {
          selectedDocs: selectedDocs,
        }
      );
      console.log("Mindmap response:", response.data);
      const markdownContent = response.data.markdown || "No mindmap available.";
      const newMindmapNote = {
        title: "Mind Map",
        content: markdownContent,
        editable: false,
        type: "mindmap",
      };
      setNotes((prevNotes: any) => [...prevNotes, newMindmapNote]);
      setMindmapMarkdown(markdownContent);
      setMindmapOpen(true);
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const playNoteAudioFromAPI = async (text: string, index: any) => {
    setClickedIndex(index);
    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingIndex(null);
      setClickedIndex(null);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-audio/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setPlayingIndex(index);
        setClickedIndex(null);
      };

      audio.onended = () => {
        setPlayingIndex(null);
        setClickedIndex(null);
      };

      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
      setPlayingIndex(null);
      setClickedIndex(null);
    }
  };

  const handleAddNote = () => {
    const newNote = {
      title: `Note ${notes.length + 1}`,
      content: "New note content...",
      editable: true,
    };
    setNotes([...notes, newNote]);
  };

  const handleToggleMenu = (index: any) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  const handleDeleteNote = (indexToDelete: any) => {
    const updatedNotes = notes.filter((_, i) => i !== indexToDelete);
    setNotes(updatedNotes);
    setMenuOpenIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNoteClick = (index: any) => {
    const note = notes[index];
    if (note.type === "mindmap") {
      setMindmapMarkdown(note.content);
      setMindmapOpen(true);
      return;
    }
    if (note.editable) {
      setCurrentEditNoteIndex(index);
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsEditModalOpen(true);
    } else {
      setCurrentViewNote(note);
      setIsViewModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[currentEditNoteIndex] = {
      ...updatedNotes[currentEditNoteIndex],
      title: editTitle,
      content: editContent,
    };
    setNotes(updatedNotes);
    setIsEditModalOpen(false);
  };

  const handleFetchAndAddNote = async (type: any) => {
    let contentEndpoint = "";
    if (type === "Study Guide")
      contentEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/study-guide`;
    else if (type === "Briefing Doc")
      contentEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/briefing-doc`;
    else if (type === "FAQ")
      contentEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/faq`;
    else return;

    const titleEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/get-note-title`;
    setLoading(true);
    try {
      const contentResponse = await fetch(contentEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedDocs }),
      });
      if (!contentResponse.ok)
        throw new Error(`Content API error: ${contentResponse.status}`);
      const content = await contentResponse.text();

      const titleResponse = await fetch(titleEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, selectedDocs }),
      });
      if (!titleResponse.ok)
        throw new Error(`Title API error: ${titleResponse.status}`);
      const rawTitle = await titleResponse.text();
      const titleData = rawTitle.replace(/^"(.*)"$/, "$1");

      const newNote = {
        title: titleData,
        content: content || "No content available.",
        editable: false,
      };
      setNotes((prev: any) => [...prev, newNote]);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newCollapsed = !prev;
      if (onCollapseChange) {
        onCollapseChange(newCollapsed);
      }
      return newCollapsed;
    });
  };

  const librarybtn =
    "flex items-center justify-center bg-[#f5f5f5] rounded-xl p-2 text-sm font-semibold cursor-pointer border border-gray-200 hover:bg-[#e0e0e0] text-black";

  return (
    <div
      className={`h-[84vh] md:border md:rounded-lg border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ml-auto ${
        isCollapsed ? "w-15" : "w-full"
      }`}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3 border-b border-gray-200">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
            onClick={toggleCollapse}
          >
            <ChevronLeft />
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center font-semibold border-b-[1.5px] border-slate-200 rounded-t-[10px] text-[#222222] h-[60px] bg-[#f8fafc] m-0">
            <span className="p-5 text-base">Library</span>
            <button
              className="cursor-pointer p-2 m-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              onClick={toggleCollapse}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="p-3">
            <AudioOverview selectedDocs={selectedDocs} />
            <div className="border-t-[1.5px] border-t-[#e2e8f0]">
              <span className="mb-2 block text-sm">Notes</span>
              <Button
                className={`w-full mb-2 ${librarybtn}`}
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </Button>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {noteTypes.map(({ label, icon: Icon }) => (
                  <Button
                    key={label}
                    className={`w-[calc(50%-4px)] ${librarybtn}`}
                    onClick={() => {
                      if (label === "Mind Map") {
                        fetchMindmap();
                      } else {
                        handleFetchAndAddNote(label);
                      }
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
              {loading && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#555]">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[#555] rounded-full animate-spin [animation-duration:0.6s]" />
                  Generating...
                </div>
              )}
              <div className="bg-white max-h-[410px] overflow-y-auto border-t border-gray-200 mt-3 px-1 pr-2 py-4">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer min-h-[40px] max-h-[55px] overflow-hidden pb-[10px] px-[10px] border border-gray-100 rounded-lg mb-3"
                    onClick={() => handleNoteClick(index)}
                  >
                    <div className="flex justify-between items-center pb-2 font-semibold">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[210px] inline-block align-middle">
                        {note.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          className={`bg-transparent cursor-pointer outline-none ${
                            clickedIndex === index
                              ? "text-red-500"
                              : playingIndex === index
                              ? "text-green-500"
                              : "text-black"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            playNoteAudioFromAPI(note.content, index);
                          }}
                        >
                          <Headphones />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMenu(index);
                          }}
                          className="bg-transparent border-none cursor-pointer text-[18px] outline-none text-black leading-none"
                        >
                          ⋮
                        </button>
                        {menuOpenIndex === index && (
                          <div
                            ref={menuRef}
                            className="absolute top-full right-0 bg-white z-10 min-w-[120px] shadow-lg rounded-md p-1"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(index);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-0 text-[#555] text-sm">
                      {note.editable ? (
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p
                                className="text-sm text-[#334] leading-relaxed m-0"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {note.content}
                        </ReactMarkdown>
                      ) : (
                        <div>
                          {note.content
                            .replace(/\\n/g, "\n")
                            .replace(/^"(.*)"$/, "$1")
                            .replace(/^["']|["']$/g, "")
                            .replace(/^#+\s*/gm, "")
                            .slice(0, 50)}
                          ...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Components */}
          <NoteEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            setEditContent={setEditContent}
            isEditable={notes[currentEditNoteIndex]?.editable || false}
          />

          <NoteViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            note={currentViewNote}
          />

          <MindmapModal
            open={mindmapOpen}
            onClose={() => setMindmapOpen(false)}
            markdown={mindmapMarkdown}
          />
        </>
      )}
    </div>
  );
};

export default CardThree;
