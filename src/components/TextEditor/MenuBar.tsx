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

// Các loại công cụ hỗ trợ
export type ToolbarItemKey =
  | "bold"
  | "italic"
  | "strike"
  | "underline"
  | "highlight"
  | "orderedList"
  | "bulletList"
  | "blockquote"
  | "code"
  | "emoji"
  | "youtube"
  | "image"
  | "link"
  | "h1"
  | "h2"
  | "h3";

interface MenuBarProps {
  editor: Editor | null;
  onAddImage?: () => void;
  onAddYoutube?: () => void;
  setShowEmojiPicker?: () => void;
  include?: ToolbarItemKey[]; // chỉ render các item được truyền
  className?: string;
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
  include = [],
  className = "",
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
    if (!editor) return;

    updateActiveStates();

    const handler = () => updateActiveStates();
    editor.on("transaction", handler);

    return () => {
      editor?.off("transaction", handler);
    };
  }, [editor, updateActiveStates]);

  const toggleHeading = (level: Level) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const toolbarMap: Record<
    ToolbarItemKey,
    {
      icon: React.ReactNode;
      onClick: () => void;
      isActive: boolean;
    }
  > = {
    bold: {
      icon: <FaBold />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      isActive: activeStates.bold,
    },
    italic: {
      icon: <FaItalic />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      isActive: activeStates.italic,
    },
    strike: {
      icon: <FaStrikethrough />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      isActive: activeStates.strike,
    },
    underline: {
      icon: <RxUnderline />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: activeStates.underline,
    },
    highlight: {
      icon: <FaHighlighter />,
      onClick: () => editor?.chain().focus().toggleHighlight().run(),
      isActive: activeStates.highlight,
    },
    orderedList: {
      icon: <LuListOrdered />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: activeStates.orderedList,
    },
    bulletList: {
      icon: <MdOutlineFormatListBulleted />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: activeStates.bulletList,
    },
    blockquote: {
      icon: <TbBlockquote />,
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: activeStates.blockquote,
    },
    code: {
      icon: <FaCode />,
      onClick: () => editor?.chain().focus().toggleCode().run(),
      isActive: activeStates.code,
    },
    emoji: {
      icon: <BsEmojiSmile />,
      onClick: () => setShowEmojiPicker?.(),
      isActive: false,
    },
    youtube: {
      icon: <BsYoutube />,
      onClick: () => onAddYoutube?.(),
      isActive: false,
    },
    image: {
      icon: <IoImageOutline />,
      onClick: () => onAddImage?.(),
      isActive: false,
    },
    link: {
      icon: <FaLink />,
      onClick: () => {
        const url = window.prompt("Nhập URL:");
        if (url) editor?.chain().focus().setLink({ href: url }).run();
      },
      isActive: activeStates.link,
    },
    h1: {
      icon: "H1",
      onClick: () => toggleHeading(Level.One),
      isActive: editor?.isActive("heading", { level: 1 }) ?? false,
    },
    h2: {
      icon: "H2",
      onClick: () => toggleHeading(Level.Two),
      isActive: editor?.isActive("heading", { level: 2 }) ?? false,
    },
    h3: {
      icon: "H3",
      onClick: () => toggleHeading(Level.Three),
      isActive: editor?.isActive("heading", { level: 3 }) ?? false,
    },
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {include.map((key) => {
        const item = toolbarMap[key];
        if (!item) return null;
        return (
          <ToolbarButton
            key={key}
            icon={item.icon}
            onClick={item.onClick}
            isActive={item.isActive}
          />
        );
      })}
    </div>
  );
}
