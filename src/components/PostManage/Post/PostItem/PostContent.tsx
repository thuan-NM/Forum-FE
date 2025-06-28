import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PostContentSkeleton } from "../../../Skeleton/PostSkeleton";
import { Image } from "@heroui/react";

const MAX_LINES = 6; // Giới hạn số dòng hiển thị ban đầu

const PostContent: React.FC<{ post: PostResponse }> = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [images, setImages] = useState<string[]>([]); // Danh sách URL của hình ảnh
  const [textContent, setTextContent] = useState(""); // Nội dung văn bản không chứa hình ảnh
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const imgElements = doc.querySelectorAll("img");
    const imgSrcs = Array.from(imgElements).map((img) => img.src);
    setImages(imgSrcs);

    imgElements.forEach((img) => img.remove());
    const cleanText = DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_TAGS: ["ol", "ul", "li"],
    });
    setTextContent(cleanText);
  }, [post.content]);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      );
      const maxHeight = lineHeight * MAX_LINES;
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [textContent]);

  const cleanContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["ol", "ul", "li"],
  });

  return (
    <div>
      {loading ? (
        <PostContentSkeleton />
      ) : (
        <>
          {/* Nội dung bài viết */}
          <motion.div
            ref={contentRef}
            initial={{ height: `${MAX_LINES * 2}rem`, opacity: 0 }}
            animate={{
              height: expanded ? "auto" : `${MAX_LINES * 2}rem`,
              opacity: 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="leading-loose overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: expanded ? cleanContent : textContent,
            }}
          />

          {/* Hiển thị hình ảnh đầu tiên khi chưa mở rộng */}
          {!expanded && images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <Image
                alt="HeroUI hero Image"
                src={images[0]}
                width="100%"
                radius="none"
              />
            </motion.div>
          )}

          {isOverflowing && (
            <div className="flex justify-end">
              <motion.button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 font-semibold hover:underline mt-2 mr-3 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {expanded ? "Less" : "More"}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostContent;
