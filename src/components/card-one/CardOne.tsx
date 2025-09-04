"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { CardData, SelectedDocs } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CardOneProps {
  selectedDocs: SelectedDocs;
  setSelectedDocs: React.Dispatch<React.SetStateAction<SelectedDocs>>;
  onCollapseChange: (collapsed: boolean) => void;
}

interface OpenedDoc {
  content: string;
  name: string;
  video?: string | null;
}

const CardOne = ({
  selectedDocs,
  setSelectedDocs,
  onCollapseChange,
}: CardOneProps) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [openedDoc, setOpenedDoc] = useState<OpenedDoc | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchCardData = async () => {
      const course = localStorage.getItem("course");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-sections/${course}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("d_tok")}`,
            },
          }
        );

        const data = await response.json();
        setCardData(data?.data);
      } catch (error) {
        console.error("Error fetching cards data ", error);
      }
    };
    fetchCardData();
  }, []);

  // this function has been added to toggle the open state of a module
  const toggleModule = (moduleName: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // eslint-disable-next-line
  const handleCheckboxChange = (doc: any) => {
    setSelectedDocs((prevSelected) => {
      // eslint-disable-next-line
      const exists = prevSelected.some((d: any) => d.uniqueId === doc.uniqueId);
      if (exists) {
        // eslint-disable-next-line
        return prevSelected.filter((d: any) => d.uniqueId !== doc.uniqueId);
      } else {
        return [...prevSelected, doc];
      }
    });
  };

  // eslint-disable-next-line
  const openDocument = async (doc: any) => {
    try {
      const course = localStorage.getItem("course");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/get-document/${course}/${doc?.mapping}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("d_tok")}`,
          },
        }
      );

      const data = await res.json();
      setOpenedDoc({
        name: doc.name,
        content: data?.data?.content,
        video: null,
      });
    } catch (error) {
      console.error("Error loading document", error);
      setOpenedDoc({
        name: doc.name,
        content: "Unable to load document.",
        video: null,
      });
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

  return (
    <div
      className={`h-[85vh] md:border md:rounded-lg transition-all duration-300 overflow-hidden
    ${isCollapsed ? "w-15" : "w-full"}
    ${
      theme === "dark"
        ? "bg-transparent border-[#3a3a3a]"
        : "bg-[#FDFDFD] border-gray-200"
    }
  `}
    >
      {isCollapsed ? (
        // When collapsed: center the button in the entire card
        <div className="flex justify-center p-3">
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
      ) : (
        // When expanded: show header + content
        <>
          <div
            className={`flex justify-between items-center font-semibold rounded-t-[10px] border-b ${
              theme === "dark" ? "border-[#3a3a3a]" : "border-gray-200"
            }`}
          >
            <span
              className={`text-lg text-sm font-semibold p-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Course Content
            </span>
            <button
              className={`cursor-pointer p-2 m-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-[#2a2a2a] text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={toggleCollapse}
            >
              <ChevronLeft />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col h-[calc(85vh-60px)]">
            <div className="flex-1 overflow-y-auto p-2">
              {openedDoc ? (
                <div className="p-4 w-full max-w-none">
                  <div className="flex justify-between items-center pl-6">
                    <h3
                      className={`uppercase${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {openedDoc.name}
                    </h3>
                    <button
                      onClick={() => setOpenedDoc(null)}
                      className={`text-xl transition-colors ${
                        theme === "dark"
                          ? "text-red-500 hover:text-red-700"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <X />
                    </button>
                  </div>

                  <div
                    className={`mt-2 w-full prose ${
                      theme === "dark"
                        ? "prose-invert max-w-none"
                        : "prose-gray max-w-none"
                    }`}
                  >
                    {openedDoc.video ? (
                      <video
                        src={openedDoc.video}
                        className="rounded-lg w-full max-h-64"
                        autoPlay
                        loop
                        controls
                        playsInline
                      />
                    ) : (
                      <div className="w-full">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {openedDoc.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line */}
                  {cardData?.modules?.map((module: any, idx: number) => {
                    const isOpen = openModules[module.name];
                    return (
                      <div key={idx} className="p-2">
                        <div
                          className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-colors ${
                            theme === "dark"
                              ? "hover:bg-[#3a3a3a] text-white"
                              : "hover:bg-gray-100 text-gray-900"
                          }`}
                          onClick={() => toggleModule(module.name)}
                        >
                          {isOpen ? (
                            <ChevronDown
                              className={`shrink-0 ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            />
                          ) : (
                            <ChevronRight
                              className={`shrink-0 ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            />
                          )}
                          <span className="font-medium text-sm">
                            {module.name}
                          </span>
                        </div>

                        {isOpen && module.documents.length > 0 && (
                          <div className="pl-6">
                            {module.documents.map(
                              // eslint-disable-next-line
                              (doc: any, docIdx: number) => {
                                return (
                                  <div
                                    key={docIdx}
                                    className="grid grid-cols-[20px_1fr_auto] items-center gap-2 py-1"
                                  >
                                    <FileText
                                      className={`h-5 w-5 shrink-0 ${
                                        theme === "dark"
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    />
                                    <span
                                      className={`cursor-pointer hover:underline transition-colors text-sm ${
                                        theme === "dark"
                                          ? "text-gray-300 hover:text-white"
                                          : "text-gray-700 hover:text-gray-900"
                                      }`}
                                      onClick={() => openDocument(doc)}
                                    >
                                      {doc.name}
                                    </span>
                                    <input
                                      type="checkbox"
                                      className={`rounded transition-colors ${
                                        theme === "dark"
                                          ? "text-blue-400 focus:ring-blue-400 border-gray-600 bg-gray-700"
                                          : "text-blue-600 focus:ring-blue-500 border-gray-300"
                                      }`}
                                      checked={selectedDocs.some(
                                        // eslint-disable-next-line
                                        (d: any) =>
                                          d.uniqueId ===
                                          `${module.name}-${doc.id}`
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange({
                                          ...doc,
                                          uniqueId: `${module.name}-${doc.id}`,
                                        })
                                      }
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardOne;
