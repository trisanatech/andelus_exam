// components/MathComponent.tsx
"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import katex from "katex";
import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import React from "react";

export const MathComponent = (props: any) => {
  const [content, setContent] = useState(props.node.attrs.content);
  const [isEditing, setIsEditing] = useState(false);
  const inline = props.node.attrs.inline;

  useEffect(() => {
    props.updateAttributes({
      content: content,
      inline: inline
    });
  }, [content, inline]);

  const renderMath = () => {
    try {
      return katex.renderToString(content, {
        displayMode: !inline,
        throwOnError: false,
        output: "mathml",
      });
    } catch (error) {
      return `<span class="text-red-500">Invalid LaTeX</span>`;
    }
  };

  return (
    <NodeViewWrapper className="math-node" as={inline ? "span" : "div"}>
      {isEditing ? (
        <textarea
          className={`bg-yellow-50 p-1 ${inline ? "w-32" : "w-full"}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <div
          className={`cursor-pointer hover:bg-gray-100 ${inline ? "inline-block" : "block"}`}
          onClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{ __html: renderMath() }}
        />
      )}
    </NodeViewWrapper>
  );
};