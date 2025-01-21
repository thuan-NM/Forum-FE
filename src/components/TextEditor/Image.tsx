import { Image } from '@heroui/react'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react'

const CustomImage = Node.create({
  name: 'customImage',
  group: 'inline',
  inline: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: 'Image' },
      width: { default: null },
      height: { default: null }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLImageElement

          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height')
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node }: NodeViewProps) => {
      const { src, alt } = node.attrs

      return (
        <NodeViewWrapper className="react-component-with-content-editable-false">
          <div
            contentEditable={false}
            draggable="true"
            className="inline-block relative cursor-move"
            data-drag-handle
          >
            <Image
              src={src}
              alt={alt}
              className="max-w-full h-auto"
              style={{ display: 'inline-block' }}
            />
          </div>
        </NodeViewWrapper>
      )
    })
  }
})

export default CustomImage