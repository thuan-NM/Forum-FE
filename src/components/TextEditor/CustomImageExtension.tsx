// CustomImageExtension.tsx
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageResize from "./Image"; // Component resize

const CustomImage = Node.create({
  name: "customImage",

  group: "block",
  draggable: true,
  selectable: true, // ✅ Cho phép select
  inline: false,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "300" },
      height: { default: null }, // Đổi thành null để component tính từ ratio
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResize);
  },
});

export default CustomImage;
