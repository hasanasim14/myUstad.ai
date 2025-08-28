"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  title: string;
  content: string;
  editable?: boolean;
  type?: string;
  Response?: string;
}

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

type MarkdownComponentProps = {
  children?: React.ReactNode;
};

const NoteViewModal = ({ isOpen, onClose, note }: NoteViewModalProps) => {
  const renderers = {
    h4: ({ children }: MarkdownComponentProps) => (
      <h4 className="font-bold mt-6 mb-2 text-lg">{children}</h4>
    ),
    h3: ({ children }: MarkdownComponentProps) => (
      <h3 className="font-bold mt-6 mb-3 text-xl">{children}</h3>
    ),
    h2: ({ children }: MarkdownComponentProps) => (
      <h2 className="font-bold mt-8 mb-4 text-2xl">{children}</h2>
    ),
    h1: ({ children }: MarkdownComponentProps) => (
      <h1 className="font-bold mt-8 mb-4 text-lg">{children}</h1>
    ),
    p: ({ children }: MarkdownComponentProps) => (
      <p className="mb-4 leading-relaxed text-gray-400">{children}</p>
    ),
    ul: ({ children }: MarkdownComponentProps) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-200">
        {children}
      </ul>
    ),
    ol: ({ children }: MarkdownComponentProps) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-200">
        {children}
      </ol>
    ),
    li: ({ children }: MarkdownComponentProps) => (
      <li className="text-gray-400">{children}</li>
    ),
    blockquote: ({ children }: MarkdownComponentProps) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
    code: ({ children }: MarkdownComponentProps) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }: MarkdownComponentProps) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    strong: ({ children }: MarkdownComponentProps) => (
      <strong className="text-xl font-bold text-white">{children}</strong>
    ),
  };

  if (!note) return null;

  const processedContent = note?.Response?.replace(/\\n/g, "\n")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^["']|["']$/g, "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold pr-8">
            {note.title}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable area */}
        <ScrollArea className="flex-1 overflow-y-auto pr-4">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
              {processedContent}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NoteViewModal;
