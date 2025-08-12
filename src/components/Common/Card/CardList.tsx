"use client";

import React from "react";
import NotFind from "../NotFind";
import { FaRegLightbulb } from "react-icons/fa";

interface CardListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const CardList = <T extends { id: string }>({
  items,
  renderItem,
}: CardListProps<T>) => {
  return (
    <>
      {items.length > 0 ? (
        <div
          className="grid gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-4
        2xl:grid-cols-5
        min-[1700px]:grid-cols-6"
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </div>
      ) : (
        <NotFind
          title="Không có chủ đề nào"
          className="!text-foreground/20 flex flex-row items-center justify-center gap-x-2 py-6 bg-content1 rounded-md"
          icon={<FaRegLightbulb className="size-10 !text-foreground/20" />}
        />
      )}
    </>
  );
};

export default CardList;
