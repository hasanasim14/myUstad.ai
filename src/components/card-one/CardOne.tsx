"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, FileText, X } from "lucide-react";
import { cardData } from "@/lib/utils";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openedDoc, setOpenedDoc] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const handleCheckboxChange = (doc: any) => {
    setSelectedDocs((prevSelected: any) => {
      const exists = prevSelected.some((d: any) => d.uniqueId === doc.uniqueId);
      if (exists) {
        return prevSelected.filter((d: any) => d.uniqueId !== doc.uniqueId);
      } else {
        return [...prevSelected, doc];
      }
    });
  };

  const openDocument = async (doc: any) => {
    try {
      const res = await fetch(doc.viewpath);
      const text = await res.text();
      setOpenedDoc({ name: doc.name, content: text });
    } catch (error) {
      console.error("Error loading document", error);
      setOpenedDoc({ name: doc.name, content: "⚠️ Unable to load document." });
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
      className={`h-[83vh] md:border md:rounded-lg border-neutral-500 transition-all duration-300 overflow-hidden text-white ${
        isCollapsed ? "w-15" : "w-full"
      }`}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3 border-b border-gray-200">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
            onClick={toggleCollapse}
          >
            <ChevronRight />
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center font-semibold border-b-[1.5px] border-slate-200 rounded-t-[10px] bg-white/5">
            <span className="text-[clamp(15px,2vw,17px)] p-[clamp(12px,2vw,19px)] text-lg font-semibold">
              {cardData.title}
            </span>
            <button
              className="cursor-pointer p-2 m-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              onClick={toggleCollapse}
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="text-sm md:text-base ml-[12px]">
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {openedDoc.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="px-4 font-medium text-gray-700">
                    Test Development and Evaluation
                  </h3>

                  <Accordion type="multiple" className="w-full">
                    {cardData.modules.map((module, idx) => (
                      <AccordionItem
                        key={idx}
                        value={module.name}
                        className="px-4"
                      >
                        <AccordionTrigger className="flex items-center gap-2 text-sm font-medium">
                          {module.name}
                        </AccordionTrigger>
                        <AccordionContent className="pl-6">
                          {module.documents.length > 0 ? (
                            module.documents.map((doc, docIdx) => (
                              <div
                                key={docIdx}
                                className="document flex items-center gap-2 py-1"
                              >
                                <FileText className="doc-icon text-gray-500" />
                                <span
                                  className="doc-link cursor-pointer hover:underline"
                                  onClick={() => openDocument(doc)}
                                >
                                  {doc.name}
                                </span>
                                <input
                                  type="checkbox"
                                  className="doc-checkbox ml-auto"
                                  checked={selectedDocs.some(
                                    (d: any) =>
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
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">
                              No documents available
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {cardData.audioOverview && (
                    <div className="extra-link px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                      ▶ Audio Overview
                    </div>
                  )}
                  {cardData.notesAndHighlights && (
                    <div className="extra-link px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                      🗒️ Notes and Highlights
                    </div>
                  )}
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
