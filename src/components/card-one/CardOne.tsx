"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cardData } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";

interface CardOneProps {
  selectedDocs: Record<string, any>;
  setSelectedDocs: (docs: Record<string, any>) => void;
  onCollapseChange: (collapsed: boolean) => void;
}

const CardOne = ({
  selectedDocs,
  setSelectedDocs,
  onCollapseChange,
}: CardOneProps) => {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openedDoc, setOpenedDoc] = useState<{
    name: string;
    content: string;
  } | null>(null);

  // eslint-disable-next-line
  const toggleModule = (moduleName: any) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // this function has been added to handle the checkbox change event
  // const handleCheckboxChange = (doc) => {
  //   setSelectedDocs(prevSelected => {
  //     const exists = prevSelected.some(d => d.id === doc.id);
  //     if (exists) {
  //       return prevSelected.filter(d => d.id !== doc.id);
  //     } else {
  //       return [...prevSelected, doc];
  //     }
  //   });
  // };

  // eslint-disable-next-line
  const handleCheckboxChange = (doc: any) => {
    // eslint-disable-next-line
    setSelectedDocs((prevSelected: any) => {
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

  // this function has been added to display the contents of a document when the user clicks on it
  // eslint-disable-next-line
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

          {/* Content */}
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

                  {cardData.modules.map((module, idx) => {
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
                                  onClick={() => openDocument(doc)}
                                >
                                  {doc.name}
                                </span>
                                <input
                                  type="checkbox"
                                  className="doc-checkbox ml-auto"
                                  checked={selectedDocs.some(
                                    // eslint-disable-next-line
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
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

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
