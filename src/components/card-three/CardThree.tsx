"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import AudioOverview from "./AudioOverview";
import MindmapModal from "./MindmapModal";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  FileText,
  GraduationCap,
  Headphones,
  Loader2,
  MessageSquareText,
  Network,
  Plus,
  Trash,
} from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import NoteEditModal from "./NoteEditModal";
import NoteViewModal from "./NoteViewModal";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const CardThree = ({ notes, setNotes, selectedDocs, onCollapseChange }) => {
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNoteIndex, setCurrentEditNoteIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loadingStates, setLoadingStates] = useState(new Set());
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewNote, setCurrentViewNote] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [podcastCache, setPodcastCache] = useState({});
  const audioRef = useRef(null);
  const abortControllers = useRef({});

  const addLoadingState = (type) => {
    setLoadingStates((prev) => new Set([...prev, type]));
  };

  const removeLoadingState = (type) => {
    setLoadingStates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
  };

  const renderers = {
    h4: ({ children }) => (
      <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>{children}</h4>
    ),
    p: ({ children }) => (
      <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>{children}</p>
    ),
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
      setNotes(data?.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchMindmap = async () => {
    const loadingKey = `Mind Map-${Date.now()}`;
    addLoadingState(loadingKey);

    const payload = {
      selectedDocs: selectedDocs,
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

      const data = await res.json();
      const markdownContent = data.markdown || "No mindmap available.";

      const newMindmapNote = {
        Title: `Mind Map - ${new Date().toLocaleString()}`,
        Response: markdownContent,
        editable: false,
        type: "mindmap",
      };

      setTimeout(fetchNotes, 500);
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      removeLoadingState(loadingKey);
    }
  };

  const playNoteAudioFromAPI = async (text, index) => {
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

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

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
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Audio playback failed:", error);
      }
      setPlayingIndex(null);
      setClickedIndex(null);
    } finally {
      delete abortControllers.current[index];
    }
  };

  const handleAddNote = () => {
    const newNote = {
      Title: `New Note - ${new Date().toLocaleString()}`,
      Response: "New note content...",
      editable: true,
    };
    setNotes([newNote, ...notes]);
  };

  const handleDeleteNote = async (docKey, indexToDelete) => {
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
        // cleanup cached blob
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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenIndex(null);
      }

      if (
        isViewModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsViewModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isViewModalOpen]);

  const handleNoteClick = (index) => {
    const note = notes[index];

    if (note.docType === "mindmap") {
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

  const handleSaveEdit = async () => {
    const updatedNote = {
      title: editTitle,
      note: editContent,
    };

    try {
      const authToken = localStorage.getItem("d_tok");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...updatedNote,
          course: localStorage.getItem("course"),
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

  const handleFetchAndAddNote = async (type) => {
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
      const authToken = localStorage.getItem("d_tok");
      const wrappedDocs = {
        selectedDocs: selectedDocs,
        course: localStorage.getItem("course"),
      };

      const contentResponse = await fetch(contentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authToken}`,
        },
        body: JSON.stringify(wrappedDocs),
      });

      if (!contentResponse.ok)
        throw new Error(`Content API error: ${contentResponse.status}`);

      const content = await contentResponse.text();

      const newNote = {
        Title: `${type} - ${new Date().toLocaleString()}`,
        content: content || "No content available.",
        editable: false,
      };

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
      if (onCollapseChange) {
        onCollapseChange(newCollapsed);
      }
      return newCollapsed;
    });
  };

  const handlePodcastLoadingChange = (isLoading) => {
    const loadingKey = `Podcast-${Date.now()}`;
    if (isLoading) {
      addLoadingState(loadingKey);
      window.currentPodcastLoadingKey = loadingKey;
    } else {
      if (window.currentPodcastLoadingKey) {
        removeLoadingState(window.currentPodcastLoadingKey);
        delete window.currentPodcastLoadingKey;
      }
    }
  };

  // fetch podcast audio
  const PodcastAudio = ({ docKey }) => {
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
      const fetchAudio = async () => {
        if (isViewModalOpen && currentViewNote?.docType === "Podcast") {
          const docKey = currentViewNote.docKey;
          if (podcastCache[docKey]) return; // already cached

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/fetch/podcast/${docKey}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (!res.ok) throw new Error("Failed to fetch podcast");

            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);
            setPodcastCache((prev) => ({ ...prev, [docKey]: audioUrl }));
          } catch (err) {
            console.error("Error fetching podcast:", err);
          }
        }
      };

      fetchAudio();
    }, [isViewModalOpen, currentViewNote, podcastCache]);

    //
    if (!audioUrl) {
      return (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading podcast...
        </div>
      );
    }

    return <audio controls src={audioUrl} className="w-full mt-2" />;
  };

  return (
    <div
      className={`h-[85vh] md:border md:rounded-lg border-[#3a3a3a] transition-all duration-300 ease-in-out overflow-hidden ml-auto text-black ${
        isCollapsed ? "w-15" : "w-full max-w-sm lg:max-w-md xl:max-w-lg"
      }`}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a] text-white"
            onClick={toggleCollapse}
          >
            <ChevronLeft />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center font-semibold border-b border-[#3a3a3a] p-2 flex-shrink-0">
            <span className="p-2 text-white">Library</span>
            <button
              className="cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a] text-white"
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

            <div className="border-y border-[#3a3a3a] pt-3 pb-3">
              <Button
                className="w-full mb-3 border border-[#3a3a3a] text-white bg-slate-700/40 hover:bg-slate-700/50 hover:border-slate-500"
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
                    className="border border-[#3a3a3a] text-white bg-slate-700/40 hover:bg-slate-700/50 hover:border-slate-500 w-[calc(50%-4px)] p-2"
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
                {/* Loading placeholders at the top */}
                {Array.from(loadingStates).map((loadingKey) => (
                  <div
                    key={loadingKey}
                    className="border border-[#3a3a3a] rounded-lg p-4 flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-700 animate-pulse">
                      Generating {loadingKey.split("-")[0]}...
                    </span>
                  </div>
                ))}

                {/* Notes list */}
                {notes && notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div
                      key={note.docKey || index}
                      onClick={() => handleNoteClick(index)}
                      className={`group relative cursor-pointer rounded-xl border transition-all duration-300 p-3
    ${
      clickedIndex === index
        ? "bg-slate-800/90 border-slate-600 shadow-lg" // clicked (active)
        : "bg-transparent border-[#3a3a3a] hover:bg-slate-700/40 hover:border-slate-500"
    }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-white truncate max-w-[210px]">
                          {note.Title}
                        </span>

                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                          {note.docType !== "Podcast" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playNoteAudioFromAPI(note.Response, index);
                              }}
                              className={`p-1 rounded-lg transition ${
                                clickedIndex === index
                                  ? "bg-red-500/20 text-red-400"
                                  : playingIndex === index
                                  ? "bg-green-500/20 text-green-400"
                                  : "hover:bg-slate-600/50 text-slate-300"
                              }`}
                            >
                              <Headphones className="w-4 h-4" />
                            </button>
                          )}

                          {/* Popover Menu */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                className="p-0 bg-transparent text-slate-300 hover:text-white hover:bg-slate-600/50 rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <EllipsisVertical className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-36 p-1 rounded-md border border-slate-600 shadow-xl"
                              align="end"
                              sideOffset={8}
                            >
                              <div className="grid gap-0.5">
                                <PopoverClose asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start gap-2 px-3 py-2 h-8 text-sm text-red-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNote(note.docKey, index);
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

                      {/* Content */}
                      <div className="mt-2 text-xs text-slate-300 leading-relaxed">
                        {note.docType === "Podcast" ? (
                          <div className="italic text-slate-400">
                            🎙 Podcast note. Open to play.
                          </div>
                        ) : note.editable ? (
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => (
                                <p
                                  className="line-clamp-1 m-0 text-xs sm:text-sm text-slate-300"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {note.Response}
                          </ReactMarkdown>
                        ) : (
                          <div className="line-clamp-1">
                            {note?.Response?.replace(/\\n/g, " ")
                              .replace(/^"(.*)"$/, "$1")
                              .replace(/^["']|["']$/g, "")
                              .replace(/^#+\s*/gm, "")
                              .slice(0, 120)}
                            {note?.Response?.length > 120 && "..."}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
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
