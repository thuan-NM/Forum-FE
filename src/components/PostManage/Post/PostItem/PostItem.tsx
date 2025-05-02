import PostHeader from "./PostHeader";
import { PostItemProp } from "../../../../store/interfaces/postInterfaces";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import CommentList from "../Comment/CommentList";
import { useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'; // Import Framer Motion

interface PostItemProps {
  post: PostItemProp;
  onDelete?: (postId: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete }) => {
  const [isShowComment, setIsShowComment] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} // Hiệu ứng fade out và slide up khi xóa
      transition={{ duration: 0.3 }} // Thời gian animation
      className="p-4 bg-content2 rounded-lg my-3 relative"
    >
      <PostHeader post={post} onDelete={() => onDelete?.(post.post_id)} />
      <PostContent post={post} />
      <PostFooter setIsShowComment={setIsShowComment} isShowComment={isShowComment} />
      <AnimatePresence>
        {isShowComment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CommentList />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostItem;