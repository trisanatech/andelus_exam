"use client";

import { useEffect, useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import DOMPurify from "dompurify";

export function SafeHTMLWithMath({ html }: { html: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Allow custom math-node elements in DOMPurify
    DOMPurify.addHook('uponSanitizeElement', (node, data) => {
      if (data.tagName === 'math-node') {
        const content = node.getAttribute('content');
        const inline = node.getAttribute('inline');
        if (content) {
          node.setAttribute('data-content', content);
          node.setAttribute('data-inline', inline || 'false');
        }
        return true;
      }
      return undefined;
    });
  }, []);

  const processedHtml = useMemo(() => {
    if (!isMounted) return "";
    
    const cleanHtml = DOMPurify.sanitize(html, {
      ADD_TAGS: ['math-node'],
      ADD_ATTR: ['content', 'inline']
    });

    const container = document.createElement("div");
    container.innerHTML = cleanHtml;

    // Process math nodes
    const mathNodes = container.querySelectorAll("math-node");
    mathNodes.forEach((mathNode) => {
      const content = mathNode.getAttribute("content") || "";
      const isInline = mathNode.getAttribute("inline") === "true";
      
      try {
        const mathHtml = katex.renderToString(content, {
          displayMode: !isInline,
          throwOnError: false,
          output: "mathml"
        });
        const wrapper = document.createElement(isInline ? "span" : "div");
        wrapper.innerHTML = mathHtml;
        mathNode.replaceWith(wrapper);
      } catch (error) {
        console.error("KaTeX error:", error);
        const errorSpan = document.createElement("span");
        errorSpan.className = "text-red-500";
        errorSpan.textContent = "\\text{[Invalid equation]}";
        mathNode.replaceWith(errorSpan);
      }
    });

    return container.innerHTML;
  }, [html, isMounted]);

  return (
    <div 
      className="prose max-w-full dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}