// components/MathComponent.tsx
"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import katex from "katex";
import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";

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
    <NodeViewWrapper
      className={`math-node ${inline ? "inline-math" : "block-math"}`}
      as={inline ? "span" : "div"}
    >
      {isEditing ? (
        <textarea
          className={`bg-background text-foreground p-1 ${
            inline ? "w-48" : "w-full"
          }`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <span
          className={`cursor-pointer hover:bg-accent/20 p-1 rounded ${
            inline ? "inline" : "block"
          }`}
          onClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{ __html: renderMath() }}
        />
      )}
    </NodeViewWrapper>
  );
};