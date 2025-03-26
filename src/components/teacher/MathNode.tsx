// extensions/MathNode.ts
import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {MathComponent} from "./MathComponent";

export const MathNode = Node.create({
  name: "math",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      content: {
        default: "x^2",
      },
      inline: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: "math-node" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-node", HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent);
  },

  addCommands() {
    return {
      insertMathInline: () => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: { inline: true, content: "x^2" },
          })
          .run();
      },
      insertMathBlock: () => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: { inline: false, content: "\\sum_{i=1}^n i" },
          })
          .run();
      },
    };
  },
});