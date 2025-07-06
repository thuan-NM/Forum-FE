import React from "react";
import CardItem from "./CardItem";

interface CardListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const CardList = <T extends { id: string }>({
  items,
  renderItem,
}: CardListProps<T>) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  );
};

export default CardList;
