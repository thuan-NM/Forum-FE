import type { UserResponse } from "./userInterfaces";
import type { TagResponse } from "./tagInterfaces";

export interface PostCreateDto {
  title: string;
  content: string;
  tags: string[];
  status?: "approved" | "pending" | "rejected"; // Add optional status
}

export interface PostUpdateDto {
  title?: string;
  content?: string;
  tags?: string[];
  status?: "published" | "draft" | "archived";
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  author: UserResponse;
  tags: TagResponse[];
  status: "approved" | "pending" | "rejected";
  ReactionCount: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostListResponse {
  posts: PostResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
