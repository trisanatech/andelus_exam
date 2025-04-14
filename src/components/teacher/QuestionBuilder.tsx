"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import FontSize from "tiptap-extension-font-size";
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { MathNode } from "./MathNode";
import { EditorToolbar } from "./EditorToolbar";

const OptionEditor = ({
  content,
  onUpdate,
  index,
}: {
  content: string;
  onUpdate: (content: string) => void;
  index: number;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Underline,
      Strike,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link,
      FontSize.configure({ types: ["textStyle"] }),
      Superscript,
      Subscript,
      MathNode,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="flex flex-col gap-2">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[50px] w-full rounded border p-2 prose max-w-full"
      />
    </div>
  );
};
export function QuestionBuilder({ index }: { index: number }) {
  const { watch, setValue } = useFormContext();
  const question = watch(`questions.${index}`);
 
  // Initialize question content: if it's a string, convert it into an object.
  let initialContent = "<p></p>";
  if (typeof question.content === "object" && question.content !== null) {
    initialContent = question.content.text || "<p></p>";
  } else if (typeof question.content === "string") {
    initialContent = question.content || "<p></p>";
    setValue(`questions.${index}.content`, { text: initialContent });
  }

  // Initialize options structure (ensure each option is an object)
  useEffect(() => {
    const initializedOptions = question.options.map((option: any) => {
      if (typeof option === "string") {
        return { text: option || "<p></p>" };
      }
      return option;
    });
    setValue(`questions.${index}.options`, initializedOptions);
  }, []);

  const questionEditor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Underline,
      Strike,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link,
      FontSize.configure({ types: ["textStyle"] }),
      MathNode,
      Superscript, 
      Subscript, 
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue(`questions.${index}.content`, { text: html });
    },
  });

  const addOption = () => {
    setValue(`questions.${index}.options`, [
      ...question.options,
      { text: "<p></p>" },
    ]);
  };

  const removeQuestion = () => {
    const currentQuestions = watch("questions");
    setValue(
      "questions",
      currentQuestions.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="rounded-lg border bg-background p-6">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="font-medium">Question {index + 1}</h3>
        <Button variant="ghost" size="sm" type="button" onClick={removeQuestion}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      {/* Question Editor */}
      <div className="mb-4">
        <EditorToolbar editor={questionEditor} />
        <EditorContent
          editor={questionEditor}
          className="min-h-[100px] rounded border p-2 prose max-w-full text-foreground bg-background focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((option: any, optionIndex: number) => (
          <div key={optionIndex} className="flex items-start gap-3 group">
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={question.correctAnswer?.includes(optionIndex.toString())}
                onCheckedChange={(checked) => {
                  const answers = checked
                    ? [...(question.correctAnswer || []), optionIndex.toString()]
                    : (question.correctAnswer || []).filter(
                        (i: string) => i !== optionIndex.toString()
                      );
                  setValue(`questions.${index}.correctAnswer`, answers);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const newOptions = [...question.options];
                  newOptions.splice(optionIndex, 1);
                  setValue(`questions.${index}.options`, newOptions);
                }}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <OptionEditor
                content={option.text}
                onUpdate={(content) => {
                  const newOptions = [...question.options];
                  newOptions[optionIndex].text = content;
                  setValue(`questions.${index}.options`, newOptions);
                }}
                index={optionIndex}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="sm" type="button" onClick={addOption}>
          Add Option
        </Button>
        <input
          type="number"
          className="w-20 rounded border px-2 py-1"
          min="1"
          value={question.points || 1}
          onChange={(e) =>
            setValue(`questions.${index}.points`, Number(e.target.value))
          }
        />
      </div>
    </div>
  );
}
