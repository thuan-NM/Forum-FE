import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { TagResponse } from "../../../../store/interfaces/tagInterfaces";

interface TagSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: TagResponse[];
  selectedTags: TagResponse[];
  onTagSelection: (tags: TagResponse[]) => void;
}

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  onClose,
  tags,
  selectedTags,
  onTagSelection,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedTags, setLocalSelectedTags] = useState<TagResponse[]>([]);
  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const filteredTags = tags.filter((tag: TagResponse) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tag: TagResponse) => {
    setLocalSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    onTagSelection(localSelectedTags);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chọn nhãn cho bài viết
            </ModalHeader>
            <ModalBody>
              <Input
                placeholder="Tìm kiếm nhãn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Icon icon="lucide:search" />}
                className="mb-4"
                isClearable
                onClear={() => setSearchQuery("")}
              />
              <div className="max-h-[80vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredTags.map((tag) => {
                    const isSelected = localSelectedTags.some(
                      (t) => t.id === tag.id
                    );
                    return (
                      <label
                        key={tag.id}
                        className={`
    flex flex-col justify-start gap-1 cursor-pointer border rounded-xl p-3 transition
    ${isSelected ? "border-blue-500 bg-blue-500/10" : "border-default"}
    hover:shadow-sm
  `}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium truncate">
                            {tag.name}
                          </span>
                          <Checkbox
                            isSelected={isSelected}
                            onValueChange={() => handleTagToggle(tag)} // ✅ giữ lại ở đây
                            size="sm"
                          />
                        </div>
                        {tag.description && (
                          <p className="text-xs text-foreground-500 leading-snug line-clamp-2">
                            {tag.description}
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

export default TagSelectionModal;
