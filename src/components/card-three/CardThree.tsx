"use client";
import { useState, useEffect, useRef } from "react";
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
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import MindmapModal from "./MindmapModal";
import AudioOverview from "./AudioOverview";
import NoteViewModal from "./NoteViewModal";
import NoteEditModal from "./NoteEditModal";

interface CardThreeProps {
  notes: Array<{
    Title: string;
    Response: string;
    editable?: boolean;
    type?: string;
  }>;
  setNotes: any;
  selectedDocs: any;
  onCollapseChange?: (collapsed: boolean) => void;
}

const CardThree = ({
  notes = [],
  setNotes,
  selectedDocs = [],
  onCollapseChange,
}: CardThreeProps) => {
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNoteIndex, setCurrentEditNoteIndex] = useState<
    number | null
  >(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewNote, setCurrentViewNote] = useState<any>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const noteTypes = [
    { label: "Study Guide", icon: GraduationCap },
    { label: "Briefing Doc", icon: FileText },
    { label: "FAQ", icon: MessageSquareText },
    { label: "Mind Map", icon: Network },
  ];

  useEffect(() => {
    // Only fetch notes if we have API endpoints configured
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      fetchNotes();
    }
  }, []);

  const fetchNotes = async () => {
    console.log("inside the get notes api");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-notes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data?.data && Array.isArray(data.data)) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchMindmap = async () => {
    setLoading(true);
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        // Demo mindmap for when API is not configured
        const demoMindmap = `# Mind Map\n\n## Main Topic\n- Subtopic 1\n  - Detail A\n  - Detail B\n- Subtopic 2\n  - Detail C\n  - Detail D`;
        const newMindmapNote = {
          title: "Mind Map",
          content: demoMindmap,
          editable: false,
          type: "mindmap",
        };
        setNotes((prevNotes: any) => [newMindmapNote, ...prevNotes]);
        setMindmapMarkdown(demoMindmap);
        setMindmapOpen(true);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-mindmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ selectedDocs }),
        }
      );
      const data = await response.json();
      const markdownContent = data?.markdown || "No mindmap available.";
      const newMindmapNote = {
        title: "Mind Map",
        content: markdownContent,
        editable: false,
        type: "mindmap",
      };
      setNotes((prevNotes: any) => [newMindmapNote, ...prevNotes]);
      setMindmapMarkdown(markdownContent);
      setMindmapOpen(true);
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const playNoteAudioFromAPI = async (text: string, index: number) => {
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

    if (!process.env.NEXT_PUBLIC_API_URL) {
      // Demo behavior when API is not configured
      console.log("Audio would play:", text.slice(0, 50) + "...");
      setPlayingIndex(index);
      setClickedIndex(null);
      setTimeout(() => {
        setPlayingIndex(null);
      }, 3000);
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

  const handleToggleMenu = (index: number) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  const handleDeleteNote = (indexToDelete: number) => {
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

  const handleNoteClick = (index: number) => {
    const note = notes[index];
    if (note.type === "mindmap") {
      setMindmapMarkdown(note.Response);
      setMindmapOpen(true);
      return;
    }
    if (note.editable) {
      setCurrentEditNoteIndex(index);
      setEditTitle(note.Title);
      setEditContent(note.Response);
      setIsEditModalOpen(true);
    } else {
      setCurrentViewNote(note);
      setIsViewModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (currentEditNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[currentEditNoteIndex] = {
        ...updatedNotes[currentEditNoteIndex],
        Title: editTitle,
        Response: editContent,
      };
      setNotes(updatedNotes);
    }
    setIsEditModalOpen(false);
  };

  const handleFetchAndAddNote = async (type: string) => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      // Demo content when API is not configured
      const demoContent = {
        "Study Guide":
          "# Study Guide\n\n## Key Concepts\n- Important topic 1\n- Important topic 2\n- Important topic 3",
        "Briefing Doc":
          "# Briefing Document\n\n## Overview\nThis is a comprehensive briefing document covering the main points.",
        FAQ: "# Frequently Asked Questions\n\n**Q: What is this?**\nA: This is a demo FAQ document.",
      };

      const newNote = {
        title: `${type} - Demo`,
        content:
          demoContent[type as keyof typeof demoContent] || "Demo content",
        editable: false,
      };
      setNotes((prev: any) => [...prev, newNote]);
      return;
    }

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
    "flex items-center justify-center bg-white/5 p-2 text-sm font-semibold border border-neutral-500 hover:bg-[#333333]";

  return (
    <div
      className={`h-[85vh] md:border md:rounded-lg border-neutral-500 transition-all duration-300 ease-in-out overflow-hidden ml-auto text-white ${
        isCollapsed ? "w-15" : "w-full max-w-sm lg:max-w-md xl:max-w-lg"
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
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center font-semibold border-b border-neutral-500 p-2 bg-white/5 flex-shrink-0">
            <span className="p-1 text-sm font-poppins">Library</span>
            <button
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              onClick={toggleCollapse}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-shrink-0 p-3 pb-0">
            <AudioOverview selectedDocs={selectedDocs} />

            <div className="border-y border-neutral-500 pt-3 p">
              <Button
                className={`w-full mb-3 ${librarybtn}`}
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </Button>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {noteTypes.map(({ label, icon: Icon }) => (
                  <Button
                    key={label}
                    className={`${librarybtn} text-sm sm:text-sm`}
                    onClick={() => {
                      if (label === "Mind Map") {
                        fetchMindmap();
                      } else {
                        handleFetchAndAddNote(label);
                      }
                    }}
                  >
                    <Icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>

              {loading && (
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-[#555]">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[#555] rounded-full animate-spin [animation-duration:0.6s]" />
                  Generating...
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden pl-3 py-3">
            <ScrollArea className="h-full">

              <div className="space-y-3 pr-4">
                {notes && notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer bg-white/5 hover:bg-white/10 transition-colors duration-200 p-3 border border-gray-100/20 rounded-lg"
                      onClick={() => handleNoteClick(index)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-sm sm:text-sm line-clamp-1 min-w-0 text-white text-ellipsis">
                          {note.Title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            className={`bg-transparent cursor-pointer outline-none transition-colors ${
                              clickedIndex === index
                                ? "text-red-500"
                                : playingIndex === index
                                ? "text-green-500"
                                : "text-white/70 hover:text-white"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              playNoteAudioFromAPI(note.Response, index);
                            }}
                          >
                            <Headphones className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMenu(index);
                            }}
                            className="bg-transparent border-none cursor-pointer text-lg outline-none text-white/70 hover:text-white leading-none"
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

                      <div className="text-[#555] text-xs sm:text-sm">
                        {note.editable ? (
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => (
                                <p
                                  className="text-xs sm:text-sm text-white/60 leading-relaxed m-0 line-clamp-2"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {note.Response}
                          </ReactMarkdown>
                        ) : (
                          <div className="text-white/60 line-clamp-1 text-xs">
                            {note.Response.replace(/\\n/g, " ")
                              .replace(/^"(.*)"$/, "$1")
                              .replace(/^["']|["']$/g, "")
                              .replace(/^#+\s*/gm, "")
                              .slice(0, 100)}
                            {note.Response.length > 100 && "..."}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white/60 py-8">
                    <p>
                      No notes yet. Click "Add note" to create your first note!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
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
            isEditable={notes[currentEditNoteIndex || 0]?.editable || false}
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
        </div>
      )}
    </div>
  );
};

export default CardThree;
