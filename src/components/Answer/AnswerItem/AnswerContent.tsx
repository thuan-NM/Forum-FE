import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import { AnswerResponse } from "../../../store/interfaces/answerInterfaces";
import { Link } from "react-router-dom";

const MAX_LINES = 6;
const LINE_HEIGHT_PX = 24;

const AnswerContent: React.FC<{ answer: AnswerResponse }> = ({ answer }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [textContent, setTextContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(answer.content, "text/html");
    const imgElements = doc.querySelectorAll("img");
    const imgSrcs = Array.from(imgElements).map((img) => img.src);
    setImages(imgSrcs);

    imgElements.forEach((img) => img.remove());
    const cleanText = DOMPurify.sanitize(doc.body.innerHTML, {
      ADD_TAGS: ["ol", "ul", "li"],
    });
    setTextContent(cleanText);
  }, [answer.content]);

  useEffect(() => {
    if (contentRef.current) {
      const maxHeight = MAX_LINES * LINE_HEIGHT_PX;
      // Chờ DOM render để đo chính xác
      requestAnimationFrame(() => {
        const scrollHeight = contentRef.current?.scrollHeight || 0;
        setIsOverflowing(scrollHeight > maxHeight);
      });
    }
  }, [textContent]);

  const cleanContent = DOMPurify.sanitize(answer.content, {
    ADD_TAGS: ["ol", "ul", "li"],
  });

  return (
    <div>
      <>
        <h2 className="font-bold mt-5 text-lg">{answer?.title}</h2>
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`relative bg-content1 py-1 text-sm  prose dark:prose-invert ${expanded ? "" : "line-clamp-5"} !w-full max-w-full px-0 ${!expanded && isOverflowing ? "overflow-hidden" : ""}`}
          dangerouslySetInnerHTML={{
            __html: expanded ? cleanContent : textContent,
          }}
        />
        <div className="flex flex-row line-clamp-1 gap-x-2">
          {answer?.tags?.map((tag) => (
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

        {/* Hiển thị hình ảnh đầu tiên khi chưa mở rộng */}
        {!expanded && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <Image
              alt="Hình ảnh nội dung câu trả lời"
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
              {expanded ? "Thu gọn" : "Tải thêm"}
            </motion.button>
          </div>
        )}
      </>
    </div>
  );
};

export default AnswerContent;
