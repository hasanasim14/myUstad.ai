"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const MarkdownViewer = () => {
  const [content, setContent] = useState("");
  const [highlight, setHighlight] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setContent(data.data.Document || "");
        setHighlight(data.data.highlight || "");
        setTitle(data.data.title || "");
      } catch (err) {
        console.error("Error loading markdown:", err);
        setContent("# Error\nCould not load the document.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  // Highlighting logic
  const highlightContent = (content: string, highlight: string) => {
    if (!highlight || !content) return content;

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const highlightPattern = escapeRegex(highlight.trim());
    const regex = new RegExp(`(${highlightPattern})`, "gi");

    return content.replace(regex, (match) => {
      return `<mark class="bg-yellow-300 px-0.5 rounded-sm">${match}</mark>`;
    });
  };

  const processedContent = highlightContent(content, highlight);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {highlight && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Highlighted Text:
              </h3>
              <div className="text-blue-900">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {highlight}
                </ReactMarkdown>
              </div>
            </div>
          )}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownViewer;
