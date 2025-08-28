"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";

interface CardOneProps {
  selectedDocs: any;
  setSelectedDocs: any;
  onCollapseChange: (collapsed: boolean) => void;
}

const CardOne = ({
  selectedDocs,
  setSelectedDocs,
  onCollapseChange,
}: CardOneProps) => {
  // this state variable has been added to keep track of which modules are open
  const [openModules, setOpenModules] = useState({});
  // this state variable has been added to store the document that is currently opened
  const [openedDoc, setOpenedDoc] = useState(null);
  const [cardData, setCardData] = useState();

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
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        setCardData(data?.data);
      } catch (error) {}
    };
    fetchCardData();
  }, []);

  // this function has been added to toggle the open state of a module
  const toggleModule = (moduleName) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };
  // maintaining the state for card
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCheckboxChange = (doc) => {
    setSelectedDocs((prevSelected) => {
      const exists = prevSelected.some((d) => d.uniqueId === doc.uniqueId);
      if (exists) {
        return prevSelected.filter((d) => d.uniqueId !== doc.uniqueId);
      } else {
        return [...prevSelected, doc];
      }
    });
  };

  // this function has been added to display the contents of a document when the user clicks on it
  const openDocument = async (doc) => {
    try {
      const fileType = doc.viewpath.split(".").pop();

      if (fileType === "mp4") {
        setOpenedDoc({ name: doc.name, content: null, video: doc.viewpath });
        return;
      }

      const course = localStorage.getItem("course");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/get-document/${course}/${doc?.mapping}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
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
        content: "⚠️ Unable to load document.",
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
      className={`h-[85vh] md:border md:rounded-lg border-[#3a3a3a] transition-all duration-300 overflow-hidden ${
        isCollapsed ? "w-15" : "w-full"
      }`}
    >
      {isCollapsed ? (
        // When collapsed: center the button in the entire card
        <div className="flex justify-center p-3">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a] text-white"
            onClick={toggleCollapse}
          >
            <ChevronRight />
          </button>
        </div>
      ) : (
        // When expanded: show header + content
        <>
          <div className="flex justify-between items-center font-semibold rounded-t-[10px] border-b border-[#3a3a3a]">
            <span className="text-lg text-white text-sm font-semibold p-4">
              Course Content
            </span>
            <button
              className="cursor-pointer p-2 m-2 rounded-lg hover:bg-[#2a2a2a] text-white"
              onClick={toggleCollapse}
            >
              <ChevronLeft />
            </button>
          </div>

          {/* Content */}
          <div className="card-content">
            <div className={`scroll-area ${!openedDoc ? "scrollable" : ""}`}>
              {openedDoc ? (
                <div className="opened-doc-full p-4">
                  <div className="flex justify-between items-center pl-6">
                    <h3 className="uppercase">{openedDoc.name}</h3>
                    <button
                      onClick={() => setOpenedDoc(null)}
                      className="text-red-500 text-xl hover:text-red-700"
                    >
                      <X />
                    </button>
                  </div>

                  <div className="mt-2 doc-content">
                    {openedDoc.video ? (
                      <video
                        src={openedDoc.video}
                        className="rounded-lg w-full max-h-64 object-cover"
                        autoPlay
                        loop
                        controls
                        playsInline
                      />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {openedDoc.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="px-4 font-medium text-gray-700">
                    {cardData?.title}
                  </h3>

                  {cardData?.modules?.map((module, idx) => {
                    const isOpen = openModules[module.name];
                    return (
                      <div key={idx} className="module px-4 py-2">
                        <div
                          className="module-header flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          onClick={() => toggleModule(module.name)}
                        >
                          {isOpen ? <ChevronDown /> : <ChevronRight />}
                          <span className="module-name font-medium">
                            {module.name}
                          </span>
                        </div>

                        {isOpen && module.documents.length > 0 && (
                          <div className="module-documents pl-6">
                            {module.documents.map((doc, docIdx) => (
                              <div
                                key={docIdx}
                                className="document flex items-center gap-2 py-1"
                              >
                                <FileText className="doc-icon text-gray-500" />
                                <span
                                  className="doc-link cursor-pointer hover:underline"
                                  onClick={() => {
                                    // console.log("the document is", doc);
                                    openDocument(doc);
                                  }}
                                >
                                  {doc.name}
                                </span>
                                <input
                                  type="checkbox"
                                  className="doc-checkbox ml-auto"
                                  checked={selectedDocs.some(
                                    (d) =>
                                      d.uniqueId === `${module.name}-${doc.id}`
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange({
                                      ...doc,
                                      uniqueId: `${module.name}-${doc.id}`,
                                    })
                                  }
                                />
                              </div>
                            ))}
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
