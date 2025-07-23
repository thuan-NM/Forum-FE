import React from "react";
import { Pagination as HeroPagination } from "@heroui/react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <HeroPagination
        showControls
        total={totalPages}
        page={page}
        onChange={onChange}
        size="sm"
        radius="full"
        color="primary"
        variant="flat"
        className="bg-content2 px-4 py-2 rounded-full shadow-sm"
      />
    </div>
  );
};

export default Pagination;
