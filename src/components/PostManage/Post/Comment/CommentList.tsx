import CommentCreation from './CommentCreation';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import CommentItem from './CommentItem';
import MoreComment from './MoreComment';
import { motion, AnimatePresence } from 'framer-motion';
// Dữ liệu mẫu
const commentsData = [
  {
    id: 1,
    author: "Jose Floren",
    date: new Date().getTime() - 2 * 365 * 24 * 60 * 60 * 1000, // 2 years ago
    content: "For fun the 6502 seems a simple and effective architecture.",
    replies: [],
  },
  {
    id: 2,
    author: "Michael Bauer",
    date: new Date().getTime() - 9 * 30 * 24 * 60 * 60 * 1000, // 9 months ago
    content:
      "A lot of cool stuff got written for 6502 back in the day. A bit challenging perhaps, to try to write code in such a simple processor. But no doubt one can find sample code to do lots of common tasks. You can also write C code, and spit out 6502 code with the proper compiler.",
    replies: [
      {
        id: 3,
        author: "Ciorba",
        date: new Date().getTime() - 2 * 365 * 24 * 60 * 60 * 1000, // 2 years ago
        content: "Thanks a million!",
        replies: [
          {
            id: 4,
            author: "Katz",
            date: new Date().getTime() - 2 * 365 * 24 * 60 * 60 * 1000, // 2 years ago
            content: "Thanks a million!",
            replies: [],
          },
        ],
      },
    ],
  },
];

const CommentList = () => {
  const [typeOfComment, setTypeOfComment] = useState<string>("recommended");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleChange = (commentType: string) => {
    setTypeOfComment(commentType);
    setIsPopoverOpen(false);
  };

  const sortedComments = [...commentsData].sort((a, b) => {
    if (typeOfComment === "most") return b.date - a.date;
    if (typeOfComment === "least") return a.date - b.date;
    return 0;
  });

  // Animation variants for staggered comments
  const commentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <CommentCreation />
      <div className="flex justify-between items-center my-3">
        <div className="font-semibold">Comments</div>
        <div>
          <Popover
            showArrow
            offset={20}
            placement="left"
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
          >
            <PopoverTrigger className="flex items-center">
              <Button
                variant="light"
                radius="full"
                className="px-2 py-0 font-semibold text-xs"
                size="sm"
              >
                {typeOfComment === "recommended" && "Recommended"}
                {typeOfComment === "most" && "Most recent"}
                {typeOfComment === "least" && "Least recent"}
                <FaChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <div className="flex flex-col !items-start rounded-full">
                <Button
                  className="bg-content1 hover:bg-content2 text-md font-light w-full !justify-start text-xs font-semibold"
                  size="sm"
                  radius="none"
                  onPress={() => handleChange("recommended")}
                >
                  Recommended
                </Button>
                <Button
                  className="bg-content1 hover:bg-content2 text-md font-light w-full !justify-start text-xs font-semibold"
                  size="sm"
                  radius="none"
                  onPress={() => handleChange("most")}
                >
                  Most recent
                </Button>
                <Button
                  className="bg-content1 hover:bg-content2 text-md font-light w-full !justify-start text-xs font-semibold"
                  size="sm"
                  radius="none"
                  onPress={() => handleChange("least")}
                >
                  Least recent
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1, // Stagger each comment by 0.1s
            },
          },
        }}
      >
        <AnimatePresence>
          {sortedComments.map((comment) => (
            <motion.div
              key={comment.id}
              variants={commentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className='border-t border-content3 py-4'
            >
              <CommentItem comment={comment} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <MoreComment />
    </div>
  );
};

export default CommentList;