import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { TopicResponse } from "../../../store/interfaces/topicInterfaces";

interface TopicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: TopicResponse[];
  selectedTopic: TopicResponse | null;
  onTopicSelect: (topic: TopicResponse) => void;
}

const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({
  isOpen,
  onClose,
  topics = [] as TopicResponse[],
  selectedTopic,
  onTopicSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelected, setLocalSelected] = useState<TopicResponse | null>(
    null
  );

  useEffect(() => {
    setLocalSelected(selectedTopic);
  }, [selectedTopic]);
  const safeTopics = Array.isArray(topics) ? topics : [];

  const filteredTopics = safeTopics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (topic: TopicResponse) => {
    setLocalSelected(topic);
  };

  const handleSave = () => {
    if (localSelected) {
      onTopicSelect(localSelected);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chọn chủ đề
            </ModalHeader>
            <ModalBody>
              <Input
                placeholder="Tìm kiếm chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Icon icon="lucide:search" />}
                className="mb-4"
              />
              <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredTopics.map((topic) => {
                    const isSelected = localSelected?.id === topic.id;
                    return (
                      <label
                        key={topic.id}
                        className={`
                          flex flex-col justify-start gap-1 cursor-pointer border rounded-xl p-3 transition
                          ${isSelected ? "border-blue-500 bg-blue-500/10" : "border-default"}
                          hover:shadow-sm
                        `}
                        onClick={() => handleSelect(topic)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium truncate">
                            {topic.name}
                          </span>
                          <Checkbox
                            isSelected={isSelected}
                            onValueChange={() => handleSelect(topic)}
                            size="sm"
                          />
                        </div>
                        {topic.description && (
                          <p className="text-xs text-foreground-500 leading-snug line-clamp-2">
                            {topic.description}
                          </p>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button color="primary" onPress={handleSave}>
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TopicSelectionModal;
