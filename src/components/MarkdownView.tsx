// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import "github-markdown-css";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import slugify from "slugify";
// import "./MarkdownViewer.css";

// const extractText = (children) => {
//   if (typeof children === "string") return children;
//   if (Array.isArray(children)) return children.map(extractText).join("");
//   if (typeof children === "object" && children?.props?.children)
//     return extractText(children.props.children);
//   return "";
// };

// const getSlug = (children) => {
//   const text = extractText(children);
//   return slugify(text, { lower: true, strict: true });
// };

// function MarkdownViewer() {
//   const location = useLocation();
//   const [content, setContent] = useState("");

//   useEffect(() => {
//     const fetchMarkdown = async () => {
//       const fullPath = decodeURIComponent(location.pathname);
//       const match = fullPath.match(/^\/docs\/([^\/]+)\/(.+)$/);
//       const bookSlug = match ? match[1] : null;
//       const slugPath = match ? match[2] : null;

//       const url = `/docs/${bookSlug}.md`;
//       console.log(url)

//       try {
//         const res = await fetch(url);
//         if (!res.ok) throw new Error("File not found");

//         const text = await res.text();
//         setContent(text);

// setTimeout(() => {
//   const hashSlug = location.hash?.substring(1);
//   const parts = slugPath?.split("/") || [];
//   const subsectionSlug = hashSlug || parts[parts.length - 2];

//   const targetHeading = document.getElementById(subsectionSlug);
//   if (!targetHeading) {
//     console.warn("❌ No heading found with id:", subsectionSlug);
//     return;
//   }

//   targetHeading.scrollIntoView({ behavior: "smooth", block: "start" });

//   const headingTag = targetHeading.tagName;
//   const parent = targetHeading.parentNode;

//   const sectionElements = [targetHeading];
//   let sibling = targetHeading.nextElementSibling;

//   while (sibling) {
//     const tag = sibling.tagName;
//     if (tag && /^H[1-6]$/.test(tag) && tag <= headingTag) break;

//     sectionElements.push(sibling);
//     sibling = sibling.nextElementSibling;
//   }

//   sectionElements.forEach((el) => el.classList.add("highlight-block"));

// sectionElements.forEach((el) => el.classList.add("highlight-block"));

// }, 800);

//       } catch (err) {
//         console.error("Markdown fetch failed:", err);
//         setContent("# Document not found");
//       }
//     };

//     fetchMarkdown();
//   }, [location]);

//   return (
//     <div className="markdown-body" style={styles.wrapper}>
//       <ReactMarkdown
//         children={content}
//         remarkPlugins={[remarkGfm]}
//         components={{
//           h1: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h1 id={slug} {...props} />;
//           },
//           h2: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h2 id={slug} {...props} />;
//           },
//           h3: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h3 id={slug} {...props} />;
//           },
//           h4: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h4 id={slug} {...props} />;
//           },
//           code({ node, inline, className, children, ...props }) {
//             const match = /language-(\w+)/.exec(className || "");
//             return !inline && match ? (
//               <SyntaxHighlighter
//                 style={oneDark}
//                 language={match[1]}
//                 PreTag="div"
//                 {...props}
//               >
//                 {String(children).replace(/\n$/, "")}
//               </SyntaxHighlighter>
//             ) : (
//               <code className={className} {...props}>
//                 {children}
//               </code>
//             );
//           },
//         }}
//       />
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "1820px",
//     margin: "2px",
//     padding: "2rem",
//     backgroundColor: "#ffffff",
//     color: "#000000",
//     borderRadius: "8px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     fontSize: "16px",
//     lineHeight: "1.7",
//   },
// };

// export default MarkdownViewer;
// THE ABOVE CODE WORKS FOR HIGHLIGHT OF THE DEEPEST SECTION/SUB SECTION/ SUB SUB SECTION THAT EXISTS - THIS DOESNT WORKS FOR HANDLING THE HIGHLIGHT OF THE SPECIFIC

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import slugify from "slugify";

const SOURCE_MAP: Record<string, string> = {
  "classroom-assessment-for-student-learning-jan-chappuis-et-al-second-edition":
    "Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
  "measurement-and-assessment-in-teaching":
    "Measurement and Assessment in Teaching",
  "a-review-of-multiple-choice-item-writing-guidelines-for-classroom-assessment":
    "A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment",
  "a-review-of-the-literature-on-marking-reliability":
    "**A REVIEW OF THE LITERATURE ON MARKING RELIABILITY**",
  "a-teacher-s-guide-to-alternative-assessment":
    "A Teacher's Guide to Alternative Assessment:",
  "can-a-picture-ruin-a-thousand-words-the-effects-of-visual-resources-in-exam-questions":
    "Can a picture ruin a thousand words?The effects of visual resources in exam questions",
  "clarifying-the-purposes-of-educational-assessment":
    "Clarifying the purposes of educational assessment",
  "clay-and-root-2001-is-this-a-trick-question-a-short-guide-to-writing-effective-test-questions":
    "Clay and Root (2001) Is This a Trick Question? A Short Guide to Writing Effective Test Questions**",
  "criteria-comparison-and-past-experiences-how-do-teachers-make-judgements-when-marking-coursework":
    "Criteria, comparison and past experiences: how do teachers make judgements when marking coursework?",
  "deficiency-contamination-and-the-signal-processing-metaphor":
    "Deficiency, Contamination, and the Signal Processing Metaphor",
  "does-washback-exist": "Does Washback Exist?",
  "language-effects-in-international-testing-the-case-of-pisa-2006-science-items":
    "Language effects in international testing: the case of PISA 2006 science items",
  "measurement-and-assessment-in-education-second-edition":
    "Measurement and Assessment in Education SECOND EDITION",
  "macro-and-micro-validation-beyond-the-five-sources-framework-for-classifying-validation-evidence-and-analysis":
    "Macro- and Micro-Validation: Beyond the ‘Five Sources’ Framework for Classifying Validation Evidence and Analysis",
  "ongoing-issues-in-test-fairness": "Ongoing issues in test fairness",
  "portfolio-purposes-teachers-exploring-the-relationshi-between-evaluation-an-learning":
    "Portfolio Purposes: Teachers Exploring the Relationshi Between Evaluation an Learning",
  "scoring-rubrics-in-the-classroom-using-performance-criteria-for-assessing-and-improving-student-performance":
    "SCORING RUBRICS IN THE CLASSROOM: USING PERFORMANCE CRITERIA FOR AssESSING AND IMPROVING STUDENT PERFORMANCE",
  "southeast-massouri-state-university-rubric-examples":
    "Southeast Massouri State University Rubric Examples",
  "standards-for-educational-and-psychological-testing":
    "**STANDARDS for Educational and Psychological Testing",
  "threats-to-the-valid-use-of-assessments":
    "Threats to the Valid Use of Assessments",
};

const stripMarkdown = (markdown: string) => {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
    .replace(/[_~>#-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeText = (text: string) =>
  text
    .replace(/[*_~`>#+=\[\]()!\\-]+/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

const findAndHighlightChunk = (markdownText: string, chunkText: string) => {
  const normalizedMarkdown = normalizeText(markdownText);
  const normalizedChunk = normalizeText(chunkText);

  if (normalizedMarkdown.includes(normalizedChunk)) {
    const lines = chunkText
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);
    let highlightedText = markdownText;

    lines.forEach((line) => {
      const escaped = line.trim().replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      const regex = new RegExp(escaped, "g");

      highlightedText = highlightedText.replace(regex, (match) => {
        return `<span class="highlight-chunk">${match}</span>`;
      });
    });

    return highlightedText;
  }

  return markdownText;
};

const MarkdownViewer = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = document.querySelector(".highlight-chunk");
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [content]);

  useEffect(() => {
    const fetchContent = async () => {
      const fullPath = router.asPath;
      const match = fullPath.match(/^\/docs\/([^\/?]+)/);
      const bookSlug = match ? match[1] : null;

      if (!bookSlug) {
        setContent("# Document not found");
        return;
      }

      const markdownUrl = `/docs/${bookSlug}.md`;
      try {
        setLoading(true);
        const res = await fetch(markdownUrl);
        if (!res.ok) throw new Error("Markdown file not found");
        let markdownText = await res.text();

        const chunkId = router.query.chunkid as string | undefined;

        if (chunkId) {
          const actualSourceName = SOURCE_MAP[bookSlug] || bookSlug;

          const apiRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/getchunk`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                source: actualSourceName,
                chunkid: chunkId,
              }),
            }
          );

          const json = await apiRes.json();

          if (json.text) {
            const highlighted = findAndHighlightChunk(markdownText, json.text);
            setContent(highlighted);
          } else {
            setContent(markdownText);
          }
        } else {
          setContent(markdownText);
        }
      } catch (err) {
        console.error("Error loading content:", err);
        setContent("# Document not found");
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchContent();
    }
  }, [router.isReady]);

  const extractText = (children: any): string => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children.map(extractText).join("");
    if (typeof children === "object" && children?.props?.children)
      return extractText(children.props.children);
    return "";
  };

  const getSlug = (children: any) => {
    const text = extractText(children);
    return slugify(text, { lower: true, strict: true });
  };

  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 id={getSlug(props.children)} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 id={getSlug(props.children)} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 id={getSlug(props.children)} {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 id={getSlug(props.children)} {...props} />
    ),
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="min-h-[89.8vh] min-w-[95.5vw] max-w-[1820px] mx-auto p-8 bg-white text-black font-['Segoe_UI'] text-[16px] leading-[1.7] rounded-lg shadow-[0_2px_10px_#0000001a] overflow-x-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-[18px] text-[#555]">
          <div className="w-4 h-4 border-2 border-[#ccc] border-t-[#555] rounded-full animate-spin [animation-duration:0.6s]" />
          <p>Loading document...</p>
        </div>
      ) : (
        <ReactMarkdown
          children={DOMPurify.sanitize(content, {
            ADD_TAGS: ["span"],
            ADD_ATTR: ["class"],
          })}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        />
      )}
    </div>
  );
};

export default MarkdownViewer;
