"use client"

import { Color } from "@tiptap/extension-color"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { memo } from "react"
import MenuBar from "./MenuBar"
import { useTheme } from "next-themes"
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Youtube from '@tiptap/extension-youtube'

import CustomImage from "./Image"

// Image.configure({
//   HTMLAttributes: {
//     class: 'my-custom-class',
//   },
// })

const extensions = [Color, StarterKit,Document, Paragraph, Text, CustomImage, Dropcursor,Youtube]


const TiptapEditor = memo(function TiptapEditor({
  initialContent = "",
  onChange = () => {},
  isDisabled=false
}: {
  initialContent: string
  onChange?: (value: string) => void,
  isDisabled:boolean
}) {
  const { theme } = useTheme()
  const editorProps = {
    attributes: {
      class: `prose ${
        theme?.includes("dark") ? "prose-invert" : ""
      }   text-color-high-emphasis  focus:outline-none  `,
    },
    handleKeyDown: () => {},
  }
  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps,
    autofocus: true,
    immediatelyRender:false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editable:!isDisabled
  })
  return (
    <div className={ `w-full max-w-full border rounded-xl p-4 bg-content2 ${isDisabled?"opacity-25":""}`}>
      <MenuBar editor={editor} />
      <div className="mt-2 min-h-60 h-full flex-grow" >
        <EditorContent editor={editor}/>
      </div>
    </div>
  )
})

export default TiptapEditor
