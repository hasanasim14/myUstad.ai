"use client";

import type React from "react";
import type { Note, SelectedDocs } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  FileText,
  MessageSquareText,
  Network,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Headphones,
  EllipsisVertical,
  Trash,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import AudioOverview from "./AudioOverview";
import MindmapModal from "./MindmapModal";
import NoteEditModal from "./NoteEditModal";
import NoteViewModal from "./NoteViewModal";

interface CardThreeProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  selectedDocs: SelectedDocs;
  onCollapseChange: (collapsed: boolean) => void;
}

const CardThree = ({
  notes,
  setNotes,
  selectedDocs,
  onCollapseChange,
}: CardThreeProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNoteIndex, setCurrentEditNoteIndex] = useState<
    number | null
  >(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewNote, setCurrentViewNote] = useState<Note | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [podcastCache, setPodcastCache] = useState<Record<string, string>>({});

  const { theme } = useTheme();
  const abortControllers = useRef<Record<number, AbortController>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const addLoadingState = (type: string) => {
    setLoadingStates((prev) => new Set([...prev, type]));
  };

  const removeLoadingState = (type: string) => {
    setLoadingStates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
  };

  const noteTypes = [
    { label: "Study Guide", icon: GraduationCap },
    { label: "Briefing Doc", icon: FileText },
    { label: "FAQ", icon: MessageSquareText },
    { label: "Mind Map", icon: Network },
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const course = localStorage.getItem("course");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/get-notes/${course}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("d_tok")}`,
          },
        }
      );

      const data = await res.json();
      setNotes(data?.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchMindmap = async () => {
    const loadingKey = `Mind Map-${Date.now()}`;
    addLoadingState(loadingKey);

    const payload = {
      selectedDocs,
      course: localStorage.getItem("course"),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/generate-mindmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("d_tok")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Mindmap API failed: ${res.status}`);
      await res.json();
      setTimeout(fetchNotes, 500);
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      removeLoadingState(loadingKey);
    }
  };

  const playNoteAudioFromAPI = async (text: string, index: number) => {
    if (clickedIndex === index && !playingIndex) {
      const controller = abortControllers.current[index];
      if (controller) {
        controller.abort();
        delete abortControllers.current[index];
      }
      setClickedIndex(null);
      return;
    }

    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingIndex(null);
      setClickedIndex(null);
      return;
    }

    const controller = new AbortController();
    abortControllers.current[index] = controller;
    setClickedIndex(index);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/generate-audio/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("d_tok")}`,
          },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        }
      );

      if (!response.ok)
        throw new Error(`API call failed with status ${response.status}`);

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
      setPlayingIndex(null);
      setClickedIndex(null);
      console.error("Error ", error);
    } finally {
      delete abortControllers.current[index];
    }
  };

  const handleAddNote = () => {
    const newNote: Note = {
      Title: `New Note - ${new Date().toLocaleString()}`,
      Response: "New note content...",
      editable: true,
    };
    setNotes([newNote, ...notes]);

    setCurrentEditNoteIndex(0);
    setEditTitle(newNote.Title ?? "");
    setEditContent(newNote.Response ?? "");
    setIsEditModalOpen(true);
  };

  const handleDeleteNote = async (docKey: string, indexToDelete: number) => {
    const updatedNotes = notes.filter((_, i) => i !== indexToDelete);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/remove-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("d_tok")}`,
          },
          body: JSON.stringify({ docKey }),
        }
      );

      if (response.ok) {
        if (podcastCache[docKey]) {
          URL.revokeObjectURL(podcastCache[docKey]);
          const newCache = { ...podcastCache };
          delete newCache[docKey];
          setPodcastCache(newCache);
        }
        setNotes(updatedNotes);
        toast.success("Note Deleted!");
      }
    } catch (error) {
      console.error("error deleting the note", error);
      toast.error("Error deleting the note. Please try again later");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isViewModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsViewModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isViewModalOpen]);

  const handleNoteClick = (index: number) => {
    const note = notes[index];

    if (note.docType === "mindmap") {
      setMindmapMarkdown(note?.Response ?? "");
      setMindmapOpen(true);
      return;
    }

    if (note.docType === "Note") {
      setCurrentEditNoteIndex(index);
      setEditTitle(note.Title ?? "");
      setEditContent(note.Response ?? "");
      setIsEditModalOpen(true);
    } else {
      setCurrentViewNote(note);
      setIsViewModalOpen(true);
    }
  };

  const handleSaveEdit = async (docKey?: string) => {
    if (currentEditNoteIndex === null) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("d_tok")}`,
        },
        body: JSON.stringify({
          title: editTitle,
          note: editContent,
          course: localStorage.getItem("course"),
          docKey: docKey || "",
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const newNotes = [...notes];
      newNotes[currentEditNoteIndex] = {
        ...newNotes[currentEditNoteIndex],
        Title: editTitle,
        Response: editContent,
        editable: false,
      };
      setNotes(newNotes);

      await fetchNotes();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleFetchAndAddNote = async (type: string) => {
    let contentEndpoint = "";

    if (type === "Study Guide")
      contentEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/study-guide`;
    else if (type === "Briefing Doc")
      contentEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/briefing-doc`;
    else if (type === "FAQ")
      contentEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/faq`;
    else return;

    const loadingKey = `${type}-${Date.now()}`;
    addLoadingState(loadingKey);

    try {
      const wrappedDocs = {
        selectedDocs,
        course: localStorage.getItem("course"),
      };

      const contentResponse = await fetch(contentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("d_tok")}`,
        },
        body: JSON.stringify(wrappedDocs),
      });

      if (!contentResponse.ok)
        throw new Error(`Content API error: ${contentResponse.status}`);

      await contentResponse.text();
      await fetchNotes();
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      removeLoadingState(loadingKey);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newCollapsed = !prev;
      onCollapseChange(newCollapsed);
      return newCollapsed;
    });
  };

  const handlePodcastLoadingChange = (isLoading: boolean) => {
    const loadingKey = `Podcast-${Date.now()}`;
    if (isLoading) {
      addLoadingState(loadingKey);
      // eslint-disable-next-line
      (window as any).currentPodcastLoadingKey = loadingKey;
    } else {
      // eslint-disable-next-line
      if ((window as any).currentPodcastLoadingKey) {
        // eslint-disable-next-line
        removeLoadingState((window as any).currentPodcastLoadingKey);
        // eslint-disable-next-line
        delete (window as any).currentPodcastLoadingKey;
      }
    }
  };

  return (
    <div
      className={`h-[85vh] md:border md:rounded-lg transition-all duration-300 ease-in-out overflow-hidden ml-auto ${
        isCollapsed ? "w-15" : "w-full max-w-sm lg:max-w-md xl:max-w-lg"
      } 
      ${
        theme === "dark"
          ? "bg-transparent border-[#3a3a3a] text-white"
          : "bg-white border-gray-200 text-gray-900"
      }
      `}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3">
          <button
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-[#2a2a2a] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={toggleCollapse}
          >
            <ChevronLeft />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div
            className={`flex justify-between items-center font-semibold border-b p-2 flex-shrink-0 ${
              theme === "dark" ? "border-[#3a3a3a]" : "border-gray-200"
            }`}
          >
            <span
              className={`p-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Library
            </span>
            <button
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-[#2a2a2a] text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={toggleCollapse}
            >
              <ChevronRight />
            </button>
          </div>

          <div className="flex-shrink-0 p-3">
            <AudioOverview
              selectedDocs={selectedDocs}
              onLoadingChange={handlePodcastLoadingChange}
              onPodcastGenerated={(audioUrl) => {
                const newNote = {
                  Title: `Podcast - ${new Date().toLocaleString()}`,
                  Response: audioUrl,
                  editable: false,
                  docType: "Podcast",
                };
                setNotes((prev) => [newNote, ...prev]);
              }}
            />

            <div
              className={`border-y pt-3 pb-3 ${
                theme === "dark" ? "border-[#3a3a3a]" : "border-gray-200"
              }`}
            >
              <Button
                className={`w-full mb-3 border transition-colors ${
                  theme === "dark"
                    ? "border-[#3a3a3a] text-white bg-slate-700/40 hover:bg-slate-700/50 hover:border-slate-500"
                    : "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                }`}
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </Button>

              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {noteTypes.map(({ label, icon: Icon }) => (
                  <Button
                    disabled={!selectedDocs.length}
                    key={label}
                    className={`border transition-colors w-[calc(50%-4px)] p-2 ${
                      theme === "dark"
                        ? "border-[#3a3a3a] text-white bg-slate-700/40 hover:bg-slate-700/50 hover:border-slate-500"
                        : "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
                    }`}
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
            </div>
          </div>

          <div className="flex-1 overflow-hidden pl-3 py-0 pb-2">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {Array.from(loadingStates).map((loadingKey) => (
                  <div
                    key={loadingKey}
                    className={`border rounded-lg p-4 flex items-center gap-2 ${
                      theme === "dark"
                        ? "border-[#3a3a3a]"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span
                      className={`text-sm animate-pulse ${
                        theme === "dark" ? "text-gray-700" : "text-gray-600"
                      }`}
                    >
                      Generating {loadingKey.split("-")[0]}...
                    </span>
                  </div>
                ))}

                {notes && notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div
                      key={note.docKey || index}
                      onClick={() => handleNoteClick(index)}
                      className={`group relative cursor-pointer rounded-xl border transition-all duration-300 p-3
    ${
      clickedIndex === index
        ? theme === "dark"
          ? "bg-slate-800/90 border-slate-600 shadow-lg"
          : "bg-blue-50 border-blue-200 shadow-lg"
        : theme === "dark"
        ? "bg-transparent border-[#3a3a3a] hover:bg-slate-700/40 hover:border-slate-500"
        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
    }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm font-semibold truncate max-w-[210px] ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {note.Title}
                        </span>

                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                          {note.docType !== "Podcast" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playNoteAudioFromAPI(
                                  note.Response ?? "",
                                  index
                                );
                              }}
                              className={`p-1 rounded-lg transition ${
                                clickedIndex === index
                                  ? theme === "dark"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-red-100 text-red-600"
                                  : playingIndex === index
                                  ? theme === "dark"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-green-100 text-green-600"
                                  : theme === "dark"
                                  ? "hover:bg-slate-600/50 text-slate-300"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Headphones className="w-4 h-4" />
                            </button>
                          )}

                          {/* Popover Menu */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                className={`p-0 bg-transparent rounded-lg transition-colors ${
                                  theme === "dark"
                                    ? "text-slate-300 hover:text-white hover:bg-slate-600/50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <EllipsisVertical className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className={`w-36 p-1 rounded-md border shadow-xl ${
                                theme === "dark"
                                  ? "border-slate-600"
                                  : "border-gray-200 bg-white"
                              }`}
                              align="end"
                              sideOffset={8}
                            >
                              <div className="grid gap-0.5">
                                <PopoverClose asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`justify-start gap-2 px-3 py-2 h-8 text-sm ${
                                      theme === "dark"
                                        ? "text-red-400 hover:text-red-400"
                                        : "text-red-600 hover:text-red-500 hover:bg-red-200"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNote(
                                        note.docKey ?? "",
                                        index
                                      );
                                    }}
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </Button>
                                </PopoverClose>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div
                        className={`mt-2 text-xs leading-relaxed ${
                          theme === "dark" ? "text-slate-300" : "text-gray-600"
                        }`}
                      >
                        {note.docType === "Podcast" ? (
                          <div
                            className={`italic ${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-gray-500"
                            }`}
                          >
                            🎙 Podcast note. Open to play.
                          </div>
                        ) : (
                          <div className="line-clamp-1">
                            {note?.Response?.replace(/\\n/g, " ")
                              .replace(/^"(.*)"$/, "$1")
                              .replace(/^["']|["']$/g, "")
                              .replace(/^#+\s*/gm, "")
                              .replace(/\*\*/g, "")
                              .replace(/---/g, "")
                              .slice(0, 120)}
                            {(note?.Response?.length ?? 0) > 120 && "..."}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`text-center py-8 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <p>
                      No notes yet. Click &quot;Add note&quot; to create your
                      first note!
                    </p>
                  </div>
                )}
              </div>

              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          {/* Open Editing Modal */}
          <NoteEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            setEditContent={setEditContent}
            docKey={notes[currentEditNoteIndex || 0]?.docKey}
          />

          {/* View Note Modal */}
          <NoteViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            note={currentViewNote}
          />

          {/* View Mindmap Modal */}
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
