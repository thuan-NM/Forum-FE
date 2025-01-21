import { Editor } from "@tiptap/react"
import { FaBold, FaCode, FaItalic, FaStrikethrough } from "react-icons/fa"
import { PiCodeBlock } from "react-icons/pi"
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
} from "react-icons/lu"
import { MdOutlineFormatListBulleted } from "react-icons/md"
import { TbBlockquote } from "react-icons/tb"
import { BsYoutube } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";

import { useCallback } from 'react'

export default function MenuBar({
  editor,
}: Readonly<{ editor: Editor | null }>) {
  if (!editor) {
    return null
  }
  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'customImage',
          attrs: { src: url, alt: 'Custom Image' },
        })
        .run()
    }
  }, [editor])

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,

      })
    }
  }
  if (!editor) {
    return null
  }
  return (
    <div className="control-group border-b">
      <div className="flex gap-x-4 items-center flex-wrap">
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBold().run()
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <FaBold className="" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <FaItalic className="" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleStrike().run()
          }}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <FaStrikethrough className="" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }}
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-content3 p-1 rounded"
              : ""
          }
        >
          <LuHeading1 className="text-2xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-content3 p-1 rounded"
              : ""
          }
        >
          <LuHeading2 className="text-2xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }}
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-content3 p-1 rounded"
              : ""
          }
        >
          <LuHeading3 className="text-2xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleOrderedList().run()
          }}
          className={
            editor.isActive("orderedList") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <LuListOrdered className="text-xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBulletList().run()
          }}
          className={
            editor.isActive("bulletList") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <MdOutlineFormatListBulleted className="text-xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBlockquote().run()
          }}
          className={
            editor.isActive("blockquote") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <TbBlockquote className="text-xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleCode().run()
          }}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={
            editor.isActive("code") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <FaCode className="text-xl" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleCodeBlock().run()
          }}
          className={
            editor.isActive("codeBlock") ? "bg-content3 p-1 rounded" : "p-1"
          }
        >
          <PiCodeBlock className="text-xl" />
        </button>
        <button onClick={addImage}>
          <IoImageOutline className="text-xl" />
        </button>
        <button id="add" onClick={addYoutubeVideo}>
          <BsYoutube className="text-xl" />
        </button>
      </div>
    </div>
  )
}
