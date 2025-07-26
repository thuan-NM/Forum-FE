import { memo, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

interface TiptapEditorProps {
  initialContent?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  setEditor?: (editor: any) => void;
  className?: string;
  containerClassName?: string;
}

const TiptapEditor = memo(function TiptapEditor({
  initialContent = "",
  onChange = () => {},
  isDisabled = false,
  setEditor,
  className,
  containerClassName,
}: TiptapEditorProps) {
  const { theme } = useTheme();

  // Tạo danh sách extension cần sử dụng
  const extensions = [
    StarterKit,
    Youtube,
    Image,
    Color,
    Highlight,
    TextStyle,
    Underline,
    Link.configure({ openOnClick: true }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      defaultAlignment: "left",
    }),
    Placeholder.configure({ placeholder: "Hãy chia sẻ điều gì đó..." }),
    BulletList,
    OrderedList,
    ListItem,
  ];

  // Thuộc tính cho editor (ví dụ: className, custom element attributes...)
  const editorProps = {
    attributes: {
      class: [
        "prose !w-full max-w-full ",
        theme?.includes("dark") ? "prose-invert" : "",
        "focus:outline-none",
      ]
        .filter(Boolean)
        .join(" "),
    },
  };

  // Khởi tạo editor
  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps,
    autofocus: true,
    editable: !isDisabled,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Trả editor ra ngoài (nếu cần dùng trong component cha)
  useEffect(() => {
    if (editor && setEditor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  return (
    <div
      className={cn(
        "w-full max-w-full rounded bg-white dark:bg-content2 shadow-lg",
        isDisabled && "opacity-50 pointer-events-none",
        containerClassName
      )}
    >
      {/* Khu vực soạn thảo */}
      <div className={cn("p-4 min-h-[65vh]", className)}>
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
});

export default TiptapEditor;
