import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Chip,
} from "@heroui/react";
import { MdClear } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetAllTopics } from "../../services";
import { TopicResponse } from "../../store/interfaces/topicInterfaces";
import { useState, useMemo } from "react";
import { FollowQuestion } from "../../services/FollowServices";
import toast from "react-hot-toast";

interface TopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  followedTopics: TopicResponse[];
}

const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onOpenChange,
  followedTopics,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["all-topics"],
    queryFn: () => GetAllTopics({ limit: 1000 }),
  });

  const allTopics: TopicResponse[] = data?.topics || [];

  const unfollowedTopics = useMemo(
    () =>
      allTopics.filter(
        (topic) => !followedTopics.some((f) => f.id === topic.id)
      ),
    [allTopics, followedTopics]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedTopics = useMemo(
    () =>
      unfollowedTopics.filter((topic) =>
        selectedIds.includes(String(topic.id))
      ),
    [selectedIds, unfollowedTopics]
  );

  const mutation = useMutation({
    mutationFn: async () => {
      for (const id of selectedIds) {
        await FollowQuestion(id, "topics");
      }
    },
    onSuccess: () => {
      toast.success("Đã thêm chủ đề thành công");
      queryClient.invalidateQueries({ queryKey: ["topic-follows"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      setSelectedIds([]);
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Không thể thêm chủ đề");
    },
  });

  const handleAddTopics = () => {
    if (selectedIds.length === 0) return;
    mutation.mutate();
  };

  const handleRemoveId = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      onOpenChange={onOpenChange}
      className="rounded-md"
      isDismissable={false}
      backdrop="blur"
      hideCloseButton
      isKeyboardDismissDisabled={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <Button
              isIconOnly
              className="border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-content2 rounded-full"
              onPress={onClose}
            >
              <MdClear className="w-7 h-7 opacity-50" />
            </Button>

            <ModalHeader className="flex flex-col gap-1 pt-1">
              <p className="text-lg font-bold">Thêm chủ đề</p>
              <p className="text-base font-light">
                Tìm và chọn nhiều chủ đề chưa theo dõi để thêm vào danh sách.
              </p>
            </ModalHeader>

            <ModalBody className="px-6 pb-6">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Autocomplete
                    label="Chọn chủ đề"
                    placeholder="Nhập tên chủ đề để tìm..."
                    selectedKey={undefined}
                    onSelectionChange={(key) => {
                      const id = String(key);
                      if (!selectedIds.includes(id)) {
                        setSelectedIds((prev) => [...prev, id]);
                      }
                    }}
                    variant="bordered"
                    size="md"
                  >
                    {unfollowedTopics.map((topic) => (
                      <AutocompleteItem
                        key={String(topic.id)}
                        textValue={topic.name}
                      >
                        {topic.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>

                  {selectedTopics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedTopics.map((topic) => (
                        <Chip
                          key={topic.id}
                          onClose={() => handleRemoveId(String(topic.id))}
                          className="bg-primary/10 text-primary font-medium"
                          variant="flat"
                          radius="sm"
                        >
                          {topic.name}
                        </Chip>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onPress={handleAddTopics}
                      isLoading={mutation.isPending}
                      isDisabled={selectedIds.length === 0}
                      size="sm"
                    >
                      Thêm {selectedTopics.length} chủ đề
                    </Button>
                  </div>
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TopicModal;
