import { Tooltip } from '@heroui/react';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { GoDotFill } from 'react-icons/go';
import { FaRegComment } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";

interface PostFooterProps {
    setIsShowComment?: (show: boolean) => void;
    isShowComment?: boolean;
}

const UpVote: React.FC<PostFooterProps> = ({ setIsShowComment, isShowComment }) => {
    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex gap-x-2 items-center'>
                <div>
                    <div className='flex items-center rounded-full p-0 border border-content3 bg-content2'>
                        <button className='!flex !justify-start text-left gap-x-1 text-xs items-center font-semibold border-r border-content3 py-[5px] px-3 hover:bg-content3 rounded-l-full'>
                            <BiUpvote className='text-lg text-blue-400' />
                            Upvote
                            <GoDotFill className='w-1 h-1' />
                            <span className='font-light'>4</span>
                        </button>
                        <Tooltip content="Downvote" placement={"top"} offset={5} closeDelay={100}>
                            <button className='px-2'>
                                <BiDownvote className='text-lg' />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <Tooltip content="Comment" placement={"top"} offset={5} closeDelay={100}>
                    <button
                        className='rounded-full p-1 px-3 hover:bg-content3'
                        onClick={() => setIsShowComment?.(!isShowComment)}
                    >
                        <div className='flex items-center text-sm gap-x-1'>
                            <FaRegComment className='' />
                            1
                        </div>
                    </button>
                </Tooltip>
                <Tooltip content="Share" placement={"top"} offset={5} closeDelay={100}>
                    <button className='rounded-full p-1 px-3 hover:bg-content3'>
                        <div className='flex items-center text-sm gap-x-1'>
                            <FaRegShareFromSquare />
                            1
                        </div>
                    </button>
                </Tooltip>
            </div>
            {/* Conditionally render CommentList with animation */}
         
        </div>
    );
};

export default UpVote;