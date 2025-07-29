"use client";

import React, { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

interface MindmapModalProps {
  open: boolean;
  onClose: () => void;
  markdown: string;
}

export default function MindmapModal({
  open,
  onClose,
  markdown,
}: MindmapModalProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const transformer = new Transformer();

  useEffect(() => {
    if (open && markdown && svgRef.current) {
      svgRef.current.innerHTML = "";
      const { root } = transformer.transform(markdown);
      Markmap.create(svgRef.current, undefined, root);
    }
  }, [open, markdown]);

  if (!open) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[10000] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-[90vw] h-[80vh] p-5 rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-[10px] right-[14px] text-[24px] bg-none border-none cursor-pointer text-[#333] outline-none"
          onClick={onClose}
        >
          ×
        </button>
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
      </div>
    </div>
  );
}
