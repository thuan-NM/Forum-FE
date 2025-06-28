import type { User, UserResponse } from "./userInterfaces";

export interface Report {
  id: string;
  reason: string;
  details?: string;
  reporter: User | string; // Can be populated with User object or just the ID
  contentType: "post" | "comment" | "user";
  contentId: string;
  status: "pending" | "resolved" | "dismissed";
  resolvedBy?: User | string; // Admin/moderator who resolved the report
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface ReportResponse {
  id: string;
  reason: string;
  details?: string;
  reporter: UserResponse;
  contentType: "post" | "comment" | "user" | "question" | "answer";
  contentId: string;
  contentPreview: string;
  status: "pending" | "resolved" | "dismissed";
  resolvedBy?: UserResponse;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReportListResponse {
  reports: ReportResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
