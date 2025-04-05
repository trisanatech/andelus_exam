// EditorToolbar.tsx
"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List as ListIcon,
  ListOrdered,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sigma,
  SuperscriptIcon, SubscriptIcon, ArrowRightIcon,
} from "lucide-react";

export function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const fontSizes = ["12px", "14px", "16px", "18px", "24px", "32px"];

  return (
    <div className="flex flex-wrap gap-1 border-b p-1">
          {/* Font Size */}
          <select
          className="h-8 rounded border bg-card px-2 text-sm text-foreground focus:outline-none"
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
          value={editor.getAttributes("textStyle").fontSize || fontSizes[2]}
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

      <Button
        type="button"
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
         {/* Underline */}
         <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive("underline") ? "bg-muted font-bold" : ""
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive("strike") ? "bg-muted font-bold" : ""
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        {/* Heading */}
        <select
          className="h-8 rounded border bg-card px-2 text-sm text-foreground focus:outline-none"
          onChange={(e) => {
            const level = Number(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level }).run();
            }
          }}
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <Button
  type="button"
  variant={editor.isActive("superscript") ? "default" : "outline"}
  size="sm"
  onClick={() => editor.chain().focus().toggleSuperscript().run()}
>
  <SuperscriptIcon className="h-4 w-4" />
</Button>

<Button
  type="button"
  variant={editor.isActive("subscript") ? "default" : "outline"}
  size="sm"
  onClick={() => editor.chain().focus().toggleSubscript().run()}
>
  <SubscriptIcon className="h-4 w-4" />
</Button>
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => editor.chain().focus().insertContent("→").run()}
>
  <ArrowRightIcon className="h-4 w-4" /> {/* or simply display the arrow as text */}
</Button>
        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive("bulletList") ? "bg-muted font-bold" : ""
          }`}
        >
          <ListIcon className="h-4 w-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive("orderedList") ? "bg-muted font-bold" : ""
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* Alignment Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive({ textAlign: "left" }) ? "bg-muted font-bold" : ""
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive({ textAlign: "center" }) ? "bg-muted font-bold" : ""
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive({ textAlign: "right" }) ? "bg-muted font-bold" : ""
          }`}
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1 hover:bg-muted rounded ${
            editor.isActive({ textAlign: "justify" }) ? "bg-muted font-bold" : ""
          }`}
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      {/* Math buttons */}
      {/* <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().insertMathInline({ content: "" }).run()}
      >
        <Sigma className="h-4 w-4" /> Inline
      </Button> */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().insertMathBlock({ content: "" }).run()}
      >
        <Sigma className="h-4 w-4" /> Block
      </Button>
    </div>
  );
}