import { useEffect, useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaCode,
  FaItalic,
  FaStrikethrough,
  FaLink,
  FaHighlighter,
} from "react-icons/fa";
import { LuListOrdered } from "react-icons/lu";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { TbBlockquote } from "react-icons/tb";
import { RxUnderline } from "react-icons/rx";
import { IoImageOutline } from "react-icons/io5";
import { BsYoutube, BsEmojiSmile } from "react-icons/bs";

import ToolbarButton from "./ToolbarButton";

interface MenuBarProps {
  editor: Editor | null;
  onAddImage?: () => void;
  onAddYoutube?: () => void;
  setShowEmojiPicker?: () => void;
}

enum Level {
  One = 1,
  Two = 2,
  Three = 3,
}

export default function MenuBar({
  editor,
  onAddImage,
  onAddYoutube,
  setShowEmojiPicker,
}: MenuBarProps) {
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    strike: false,
    underline: false,
    highlight: false,
    orderedList: false,
    bulletList: false,
    blockquote: false,
    code: false,
    link: false,
  });

  // Cập nhật trạng thái active
  const updateActiveStates = useCallback(() => {
    if (editor) {
      setActiveStates({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),
        underline: editor.isActive("underline"),
        highlight: editor.isActive("highlight"),
        orderedList: editor.isActive("orderedList"),
        bulletList: editor.isActive("bulletList"),
        blockquote: editor.isActive("blockquote"),
        code: editor.isActive("code"),
        link: editor.isActive("link"),
      });
    }
  }, [editor]);


  useEffect(() => {
    if (editor) {
      updateActiveStates();
      editor.on("transaction", updateActiveStates);
      return () => {
        editor.off("transaction", updateActiveStates);
      };
    }
  }, [editor, updateActiveStates]);

  // Toggle heading
  const toggleHeading = (level: Level) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  };

  // Mảng toolbar items
  const toolbarItems = [
    {
      icon: <FaBold />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      isActive: activeStates.bold,
    },
    {
      icon: <FaItalic />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      isActive: activeStates.italic,
    },
    {
      icon: <FaStrikethrough />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      isActive: activeStates.strike,
    },
    {
      icon: <RxUnderline />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: activeStates.underline,
    },
    {
      icon: <FaHighlighter />,
      onClick: () => editor?.chain().focus().toggleHighlight().run(),
      isActive: activeStates.highlight,
    },
    {
      icon: <LuListOrdered />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: activeStates.orderedList,
    },
    {
      icon: <MdOutlineFormatListBulleted />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: activeStates.bulletList,
    },
    {
      icon: <TbBlockquote />,
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: activeStates.blockquote,
    },
    {
      icon: <FaCode />,
      onClick: () => editor?.chain().focus().toggleCode().run(),
      isActive: activeStates.code,
    },
    // Nút mở emoji picker
    {
      icon: <BsEmojiSmile />,
      onClick: setShowEmojiPicker, isActive: false,
    },
    {
      icon: <BsYoutube />,
      onClick: onAddYoutube,
      isActive: false,
    },
    {
      icon: <IoImageOutline />,
      onClick: onAddImage,
      isActive: false,
    },
    {
      icon: <FaLink />,
      onClick: () => {
        const url = window.prompt("Nhập URL:");
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: activeStates.link,
    },
    {
      icon: "H1",
      onClick: () => toggleHeading(Level.One),
      isActive: false,
    },
    {
      icon: "H2",
      onClick: () => toggleHeading(Level.Two),
      isActive: false,
    },
    {
      icon: "H3",
      onClick: () => toggleHeading(Level.Three),
      isActive: false,
    },
  ];

  return (
    <div className="flex flex-wrap">

      {/* Toolbar Items */}
      {toolbarItems.map((item, index) => (
        <ToolbarButton
          key={index}
          icon={item.icon}
          onClick={item.onClick}
          isActive={item.isActive}
        />
      ))}
    </div>
  );
}
