import type { Topic, TopicResponse } from "./topicInterfaces";
import type { User, UserResponse } from "./userInterfaces";

export interface Question {
  id: string;
  title: string;
  content: string;
  slug: string;
  author: User | string;
  topic: Topic | string;
  status: "open" | "closed" | "solved" | "duplicate";
  viewCount: number;
  votedBy: { userId: string; voteType: "up" | "down" }[];
  acceptedAnswerId?: string;
  duplicateOfId?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  ollowCount: number;
}

export interface QuestionCreateDto {
  title: string;
  content: string;
  topicId: string;
}

export interface QuestionUpdateDto {
  title?: string;
  content?: string;
  topicId?: string;
  status?: "open" | "closed" | "solved" | "duplicate";
  acceptedAnswerId?: string;
  duplicateOfId?: string;
  isFeatured?: boolean;
}

export interface QuestionResponse {
  id: string;
  title: string;
  author: UserResponse;
  topic: TopicResponse;
  interactionStatus: "open" | "closed" | "solved";
  status: "approved" | "pending" | "rejected";
  answersCount: number;
  followsCount: number;
  createdAt: Date;
  updatedAt: Date;
  reactionsCount: number;
  lastFollowed: Date;
}

export interface QuestionListResponse {
  questions: QuestionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
