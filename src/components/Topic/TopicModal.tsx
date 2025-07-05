import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { MdClear } from "react-icons/md";
import TopicList from "./TopicList";

interface TopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TopicModal: React.FC<TopicModalProps> = ({ isOpen, onOpenChange }) => {
  const animals = [
    {
      label: "Cat",
      key: "cat",
      description: "The second most popular pet in the world",
    },
    {
      label: "Dog",
      key: "dog",
      description: "The most popular pet in the world",
    },
    {
      label: "Elephant",
      key: "elephant",
      description: "The largest land animal",
    },
    { label: "Lion", key: "lion", description: "The king of the jungle" },
    { label: "Tiger", key: "tiger", description: "The largest cat species" },
    {
      label: "Giraffe",
      key: "giraffe",
      description: "The tallest land animal",
    },
    {
      label: "Dolphin",
      key: "dolphin",
      description: "A widely distributed and diverse group of aquatic mammals",
    },
    {
      label: "Penguin",
      key: "penguin",
      description: "A group of aquatic flightless birds",
    },
    {
      label: "Zebra",
      key: "zebra",
      description: "A several species of African equids",
    },
    {
      label: "Shark",
      key: "shark",
      description:
        "A group of elasmobranch fish characterized by a cartilaginous skeleton",
    },
    {
      label: "Whale",
      key: "whale",
      description: "Diverse group of fully aquatic placental marine mammals",
    },
    {
      label: "Otter",
      key: "otter",
      description: "A carnivorous mammal in the subfamily Lutrinae",
    },
    {
      label: "Crocodile",
      key: "crocodile",
      description: "A large semiaquatic reptile",
    },
  ];
  return (
    <>
      <Modal
        isOpen={isOpen}
        size={"2xl"}
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
              <>
                <ModalHeader className="flex flex-col gap-1 pt-1">
                  <p className="text-lg font-bold">Topics you know about</p>
                  <p className="text-base font-light">
                    Topics are how Quora knows what questions to send your way.
                    Be as comprehensive and specific as possible to get the most
                    relevant questions.
                  </p>
                </ModalHeader>
                <ModalBody className="px-0 py-0">
                  <Autocomplete
                    className="w-full px-6"
                    radius="none"
                    label="Add topic"
                    variant="bordered"
                    size="sm"
                  >
                    {animals.map((animal) => (
                      <AutocompleteItem key={animal.key}>
                        {animal.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <TopicList />
                </ModalBody>
              </>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TopicModal;
