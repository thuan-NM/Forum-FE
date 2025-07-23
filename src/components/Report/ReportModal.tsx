"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { useCreateReport } from "../../hooks/reports/useCreateReport";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: string;
  contentPreview: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentType,
  contentPreview,
}) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  console.log;
  const { CreateReportHook, isCreating } = useCreateReport();

  const handleSubmit = () => {
    CreateReportHook(reason, contentType, contentId, contentPreview, details);
    onClose();
    setReason("");
    setDetails("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">
          Report Content
        </ModalHeader>
        <ModalBody className="space-y-3">
          <Input
            label="Reason"
            placeholder="Why are you reporting this?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            isRequired
          />
          <Textarea
            label="Details (optional)"
            placeholder="Provide more details (optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            isLoading={isCreating}
            onPress={handleSubmit}
            isDisabled={!reason}
          >
            Submit Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
