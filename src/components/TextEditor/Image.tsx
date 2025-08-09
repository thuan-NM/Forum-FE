// Image.tsx
"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface ImageResizeProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
}

export default function ImageResize({
  node,
  updateAttributes,
  selected,
}: ImageResizeProps) {
  const { src, alt, title, width, height } = node.attrs;

  const initialWidth = parseFloat(width) || 300;
  const initialHeight = parseFloat(height) || 0;

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: initialWidth,
    height: initialHeight,
  });
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      console.log("Image loaded", {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
      const naturalRatio = img.naturalHeight / img.naturalWidth || 1;
      setAspectRatio(naturalRatio);
      const calculatedHeight = size.width * naturalRatio;
      setSize((prev) => ({
        ...prev,
        height: calculatedHeight,
      }));
      if (!height || height === "auto") {
        updateAttributes({
          height: calculatedHeight,
        });
      }
    };
    img.onerror = () => {
      console.error("Failed to load image:", src);
    };
  }, [src, size.width, height, updateAttributes]);

  const handleResize = (data: any) => {
    const newWidth = data.size.width;
    const newHeight = newWidth * aspectRatio;
    console.log("Resizing", { newWidth, newHeight });
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeStop = (data: any) => {
    const newWidth = data.size.width;
    const newHeight = newWidth * aspectRatio;
    console.log("Resize stopped", { newWidth, newHeight });
    updateAttributes({
      width: newWidth,
      height: newHeight,
    });
    setSize({ width: newWidth, height: newHeight });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("Handle mouse down");
    e.stopPropagation();
  };

  return (
    <NodeViewWrapper
      className={cn(
        "relative my-4 inline-block",
        selected && "ring-2 ring-blue-500 p-1"
      )}
      contentEditable={false}
      draggable={false} // Tắt draggable để tránh xung đột
    >
      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        resizeHandles={["e"]}
        minConstraints={[50, 50]}
        maxConstraints={[1200, 1200]}
        handle={(h) => (
          <div
            className={cn(
              `react-resizable-handle react-resizable-handle-${h}`,
              "absolute right-0 top-0 h-full w-3 bg-blue-500 opacity-50 hover:opacity-100 cursor-ew-resize z-50"
            )}
            onMouseDown={handleMouseDown}
          ></div>
        )}
      >
        <div
          style={{ width: size.width, height: size.height }}
          className="relative border rounded-md overflow-hidden"
        >
          <img
            src={src}
            alt={alt || ""}
            title={title || ""}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
            className={cn(selected && "ring-2 ring-blue-500")}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      </Resizable>
    </NodeViewWrapper>
  );
}
