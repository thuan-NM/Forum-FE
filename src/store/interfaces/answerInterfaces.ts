import type { Comment } from "./commentInterfaces";
import type { QuestionResponse } from "./questionInterfaces";
import type { TagResponse } from "./tagInterfaces";
import type { UserResponse } from "./userInterfaces";

export interface AnswerResponse {
  id: string;
  title: string;
  content: string;
  status: "approved" | "pending" | "rejected";
  isAccepted: boolean;
  rootCommentId?: string;
  hasEditHistory: boolean;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  author: UserResponse;
  question: QuestionResponse;
  tags: TagResponse[];
  reactionsCount: number;
}

export interface AnswerCreateDto {
  content: string;
  tags: string[];
  questionId: string;
  title: string;
  status?: "approved" | "pending" | "rejected"; // Add optional status
}

export interface AnswerUpdateDto {
  content?: string;
  answerContent?: string;
  isAccepted?: boolean;
  tags: string[];
  title?: string;
  status?: "approved" | "pending" | "rejected";
}

export interface Answer {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  status: "approved" | "pending" | "rejected";
  isAccepted: boolean;
  rootCommentId?: string;
  hasEditHistory: boolean;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  username: string;
  questionTitle: string;
}
