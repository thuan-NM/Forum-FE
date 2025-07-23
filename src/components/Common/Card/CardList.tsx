"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const CardList = <T extends { id: string }>({
  items,
  renderItem,
}: CardListProps<T>) => {
  return (
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
  );
};

export default CardList;
