import { PostResponse } from "../../../../store/interfaces/postInterfaces";
import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import { Link } from "react-router-dom";

const MAX_LINES = 6;
const LINE_HEIGHT_PX = 24;

const PostContent: React.FC<{ post: PostResponse }> = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [textContent, setTextContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse nội dung và xử lý
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    // Tách hình ảnh
    const imgElements = doc.querySelectorAll("img");
    const imgSrcs = Array.from(imgElements).map((img) => img.src);
    setImages(imgSrcs);

    // Xóa img khỏi nội dung chính
    imgElements.forEach((img) => img.remove());

    // Lấy lại nội dung đã clean
    const cleanText = DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_TAGS: ["ol", "ul", "li"],
    });
    setTextContent(cleanText);
  }, [post.content]);

  // Kiểm tra overflow
  useEffect(() => {
    if (contentRef.current) {
      const maxHeight = MAX_LINES * LINE_HEIGHT_PX;
      requestAnimationFrame(() => {
        const scrollHeight = contentRef.current?.scrollHeight || 0;
        setIsOverflowing(scrollHeight > maxHeight);
      });
    }
  }, [textContent]);

  const cleanContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["ol", "ul", "li"],
  });

  return (
    <div>
     
        <>
          <h2 className="font-bold mt-5 text-lg">{post.title}</h2>

          {/* Nội dung bài viết */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`relative bg-content1 py-1 text-sm prose dark:prose-invert max-w-full w-full px-0 prose-img:!max-w-full prose-img:rounded-md prose-img:!h-auto ${expanded ? "" : "line-clamp-5"} ${!expanded && isOverflowing ? "overflow-hidden" : ""}`}
            dangerouslySetInnerHTML={{
              __html: expanded ? cleanContent : textContent,
            }}
            content="text/html"
          />
          <div className="flex flex-row line-clamp-1 gap-x-2">
            {post?.tags?.map((tag) => (
              <div key={tag.id} className="flex">
                <Link
                  to={`/tags/${tag.id}`}
                  className="text-blue-500 hover:underline"
                >
                  #{tag.name}
                </Link>
              </div>
            ))}
          </div>
          {/* Hiệu ứng bóng mờ cuối nội dung */}
          {!expanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-b-md" />
          )}

          {/* Hình ảnh đầu tiên nếu chưa mở rộng */}
          {!expanded && images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <Image
                alt="Post preview image"
                src={images[0]}
                width="100%"
                className="max-h-[300px] rounded-md object-cover"
                radius="sm"
              />
            </motion.div>
          )}

          {/* Nút More / Less */}
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
    </div>
  );
};

export default PostContent;
