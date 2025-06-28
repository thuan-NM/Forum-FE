import { Avatar, Button } from "@heroui/react";

const CommentCreation = () => {
  return (
    <div className="flex pt-3 items-center gap-x-2  !py-3 bg-content2 rounded-lg px-3">
      <Avatar
        size="sm"
        radius="full"
        className="w-6 h-6 sm:w-8 sm:h-8"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <input
        placeholder="Add a comment..."
        type="text"
        className="bg-content1 rounded-full w-3/4 !px-3 py-1 text-base"
      />
      <Button
        size="sm"
        color="primary"
        radius="full"
        className="h-8 font-semibold"
      >
        Add comment
      </Button>
    </div>
  );
};

export default CommentCreation;
