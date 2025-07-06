import { Button } from "@heroui/react";
import { BsMailbox } from "react-icons/bs";
interface NoTopicProps {
  onOpen: () => void;
}
const NoTopic: React.FC<NoTopicProps> = ({ onOpen }) => {
  return (
    <div className="flex justify-center flex-col my-2 gap-y-1 mx-auto py-6 px-2 items-center">
      <BsMailbox className="w-10 h-10 opacity-60 mx-auto" />
      <div className="mx-auto font-bold text-sm opacity-60">No topics yet</div>
      <div className="mx-auto text-xs text-light text-center opacity-50">
        You’ll get better questions if you add more specific topics.
      </div>
      <Button
        color="primary"
        radius="full"
        className="w-fit mx-auto mt-4 font-semibold"
        variant="bordered"
        onPress={onOpen}
      >
        Add topics
      </Button>
    </div>
  );
};

export default NoTopic;
