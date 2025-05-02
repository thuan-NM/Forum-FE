import EmojiPicker from 'emoji-picker-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPickerComponent({ onSelect }: EmojiPickerProps) {
  const handleSelect = (emojiObject: any) => {
    onSelect(emojiObject.emoji);
  };

  return (
    <div style={{ position: "absolute", zIndex: 1000 }}>
      <EmojiPicker onEmojiClick={handleSelect} />
    </div>
  );
}
