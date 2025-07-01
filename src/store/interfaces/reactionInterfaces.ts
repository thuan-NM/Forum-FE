// store/interfaces/reactionInterfaces.ts
export interface ReactionCreateDto {
  user_id: number;
  reactable_id: number;
  reactable_type: string; // "Post", "Comment", "Answer"
}

export interface ReactionResponse {
  id: number;
  user_id: number;
  reactable_id: number;
  reactable_type: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string; // Giả định
  };
}
