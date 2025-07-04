// src/store/interfaces/reactionInterfaces.ts
export interface UserResponse {
  id: number;
  username?: string; // Thêm các trường khác nếu cần
  // Các trường khác của user
}

export interface ReactionResponse {
  id: number;
  user_id: number;
  post_id?: number;
  comment_id?: number;
  answer_id?: number;
  created_at: string;
  updated_at: string;
  user?: UserResponse; // Đảm bảo user khớp với UserResponse
}

export interface ReactionCreateDto {
  post_id?: number;
  comment_id?: number;
  answer_id?: number;
}
