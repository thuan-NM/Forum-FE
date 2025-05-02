import { Avatar, Button, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@heroui/react';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { GoDotFill } from 'react-icons/go';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { format } from 'timeago.js';

// Định nghĩa kiểu dữ liệu cho comment
interface Comment {
    id: number;
    author: string;
    date: number;
    content: string;
    replies: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    level?: number; // Thêm level để kiểm soát độ lồng (indentation)
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level = 0 }) => {
    return (
        <div
            className="flex mt-4 "
            style={{ marginLeft: `${level * 5}px` }} // Thụt lề cho các comment con
        >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                <Avatar
                    size="sm"
                    radius="full"
                    className="w-full h-full object-cover"
                    src={`https://i.pravatar.cc/150?img=${comment.author}`}
                />
            </div>
            <div className="flex flex-col gap-y-1 pl-2 !text-xs md:text-sm w-full">
                <div className="flex gap-x-1">
                    <div className="font-bold flex flex-wrap items-center gap-x-1">
                        <div>{comment.author}</div>
                        <GoDotFill className="w-2 h-2 hidden sm:block" />
                    </div>
                    <div className="opacity-90 text-xs flex flex-wrap !items-center">
                        <div>{format(comment.date)}</div>
                    </div>
                </div>
                <div>
                    <div className="text-sm">{comment.content}</div>
                    <div className="flex justify-between items-center">
                        <div className="w-fit mt-2 flex gap-x-2">
                            <div className="flex items-center rounded-full p-0 border border-content3 bg-content2">
                                <button className="!flex !justify-start text-left gap-x-1 text-xs items-center font-semibold border-r border-content3 py-[5px] px-3 hover:bg-content3 rounded-l-full">
                                    <BiUpvote className="text-lg text-blue-400" />
                                </button>
                                <Tooltip content="Downvote" placement="top" offset={5} closeDelay={100}>
                                    <button className="px-2">
                                        <BiDownvote className="text-lg" />
                                    </button>
                                </Tooltip>
                            </div>
                            <Button size="sm" variant="light" radius="full">
                                Reply
                            </Button>
                        </div>
                        <Popover placement="top-start">
                            <PopoverTrigger className="flex items-center">
                                <Button
                                    size="sm"
                                    variant="flat"
                                    radius="full"
                                    className="bg-transparent"
                                    isIconOnly
                                >
                                    <HiOutlineDotsHorizontal className="text-lg cursor-pointer" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <div className="flex flex-col !items-start rounded-full">
                                    <Button
                                        className="bg-content1 hover:bg-content2 text-md font-light w-full !justify-start text-xs font-semibold"
                                        size="sm"
                                        radius="none"
                                    >
                                        Report
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Render các reply comment (đệ quy) */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="reply-comment mt-4">
                            {comment.replies.map((reply) => (
                                <CommentItem key={reply.id} comment={reply} level={level + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;