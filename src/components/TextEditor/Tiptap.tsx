import { memo, useEffect, useCallback } from "react";
import { AnyExtension, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Youtube from "@tiptap/extension-youtube";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";
import debounce from "lodash/debounce";
import ImageResize from "tiptap-extension-resize-image";
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

  const extensions: AnyExtension[] = [
    StarterKit.configure({ codeBlock: false }),
    Youtube,
    ImageResize,
    Color,
    Highlight.configure({ multicolor: true }),
    TextStyle,
    Underline,
    Link.configure({ openOnClick: true }),
    TextAlign.configure({ types: ["heading", "paragraph", "customImage"] }),
    Placeholder.configure({ placeholder: "Hãy chia sẻ điều gì đó..." }),
    BulletList,
    OrderedList,
    ListItem,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ];

  const editorProps = {
    attributes: {
      class: cn(
        "prose !w-full max-w-full",
        theme?.includes("dark") && "prose-invert",
        "focus:outline-none"
      ),
    },
    handleDrop: (view: any, event: DragEvent) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer?.files || []);
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target?.result as string;
            const { state, dispatch } = view;
            const tr = state.tr.insert(
              state.selection.from,
              state.schema.nodes.customImage.create({ src })
            );
            dispatch(tr);
          };
          reader.readAsDataURL(file);
        }
      });
      return true;
    },
  };

  const debouncedOnChange = useCallback(debounce(onChange, 300), [onChange]);

  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps,
    autofocus: true,
    editable: !isDisabled,
    onUpdate: ({ editor }) => debouncedOnChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && setEditor) setEditor(editor);
  }, [editor, setEditor]);

  return (
    <div
      className={cn(
        "w-full max-w-full rounded bg-white dark:bg-content2 shadow-lg",
        isDisabled && "opacity-50 pointer-events-none",
        containerClassName
      )}
    >
      <div className={cn("p-4 min-h-[65vh]", className)}>
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
});

export default TiptapEditor;
