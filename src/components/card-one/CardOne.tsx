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
      className={`h-[85vh] md:border md:rounded-lg border-gray-200 transition-all duration-300 overflow-hidden ${
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
          <div className="flex justify-between items-center font-semibold border-b-[1.5px] border-slate-200 rounded-t-[10px] text-[#222222] bg-[#f8fafc]">
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

// below is the implementation for opening a pdf instead of a markdown file in the left panel when the user clicks on the document name
//   const openDocument = (doc) => {
//   setOpenedDoc({
//     name: doc.name,
//     viewpath: doc.viewpath
//   });
// };

{
  /* <div className="card-content">
  {openedDoc ? (
    <div className="opened-doc-full" style={{ padding: '20px', backgroundColor: ' f9f9f9', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{openedDoc.name}</h3>
        <button
          onClick={() => setOpenedDoc(null)}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ❌
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {openedDoc.viewpath.toLowerCase().endsWith('.pdf') ? (
          // === Render PDF in iframe ===
          <iframe
            src={openedDoc.viewpath}
            title={openedDoc.name}
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          ></iframe>
        ) : (
          // === Fallback if not PDF, treat as text/markdown ===
          <ReactMarkdown>{openedDoc.content}</ReactMarkdown>
        )}
      </div>
    </div>
  ) : (
    // === Normal modules view ===
    <>
      <h3>Test Development and Evaluation</h3>

      {cardData.modules.map((module, idx) => {
        const isOpen = openModules[module.name];
        return (
          <div key={idx} className="module">
            <div className="module-header" onClick={() => toggleModule(module.name)}>
              {isOpen ? <FiChevronDown /> : <FiChevronRight />}
              <span className="module-name">{module.name}</span>
            </div>
            {isOpen && module.documents.length > 0 && (
              <div className="module-documents">
                {module.documents.map((doc, docIdx) => (
                  <div key={docIdx} className="document">
                    <FiFileText className="doc-icon" />
                    <span
                      className="doc-link"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openDocument(doc)}
                    >
                      {doc.name}
                    </span>
                    <input
                      type="checkbox"
                      className="doc-checkbox"
                      checked={selectedDocs.some(d => d.id === doc.id)}
                      onChange={() => handleCheckboxChange(doc)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {cardData.audioOverview && <div className="extra-link">▶ Audio Overview</div>}
      {cardData.notesAndHighlights && <div className="extra-link">🗒️ Notes and Highlights</div>}
    </>
  )}
</div> */
}
