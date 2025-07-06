import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import { AnswerResponse } from "../../../store/interfaces/answerInterfaces";
import { AnswerContentSkeleton } from "../../Skeleton/AnswerSkeleton";

const MAX_LINES = 6;
const LINE_HEIGHT_PX = 24;

const AnswerContent: React.FC<{ answer: AnswerResponse }> = ({ answer }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [textContent, setTextContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

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
      {loading ? (
        <AnswerContentSkeleton />
      ) : (
        <>
          <h2 className="font-bold mt-5 text-lg">{answer.title}</h2>
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`leading-[${LINE_HEIGHT_PX}px] bg-content1 ${
              !expanded && isOverflowing ? "overflow-hidden" : ""
            }`}
            style={{
              maxHeight:
                !expanded && isOverflowing
                  ? `${MAX_LINES * LINE_HEIGHT_PX}px`
                  : "none",
            }}
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
                alt="Answer content image"
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

export default AnswerContent;
