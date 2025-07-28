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
      const naturalRatio = img.naturalHeight / img.naturalWidth;
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
  }, [src, size.width, height, updateAttributes]);

  const handleResize = (e: any, data: any) => {
    const newWidth = data.size.width;
    const newHeight = newWidth * aspectRatio;
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeStop = (e: any, data: any) => {
    const newWidth = data.size.width;
    const newHeight = newWidth * aspectRatio;
    updateAttributes({
      width: newWidth,
      height: newHeight,
    });
    setSize({ width: newWidth, height: newHeight });
  };

  // Ngăn chặn drag khi click vào handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn event bubble lên NodeViewWrapper để tránh trigger drag di chuyển
  };

  return (
    <NodeViewWrapper
      className={cn(
        "relative my-4 inline-block",
        selected && "ring-2 ring-blue-500 p-1"
      )} // Thêm inline-block để dễ di chuyển
      contentEditable={false}
      draggable={true}
    >
      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        resizeHandles={["e"]} // Giữ handle phải
        minConstraints={[100, 100]}
        maxConstraints={[800, 800]}
        handle={(h) => (
          <div
            className={cn(
              `react-resizable-handle react-resizable-handle-${h}`,
              "absolute right-0 top-0 h-full w-3 bg-blue-500 opacity-50 hover:opacity-100 cursor-ew-resize z-10" // Style handle rõ hơn: thanh dọc bên phải, màu xanh, hover hiện rõ
            )}
            onMouseDown={handleMouseDown} // Ngăn drag khi click handle
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
            onMouseDown={(e) => e.stopPropagation()} // Optional: Ngăn drag nếu click trực tiếp img, nhưng giữ để di chuyển
          />
        </div>
      </Resizable>
    </NodeViewWrapper>
  );
}
