export interface Topic {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  createdAt: Date;
}

export interface TopicCreateDto {
  name: string;
  description?: string;
  parentId?: string;
}

export interface TopicUpdateDto {
  name?: string;
  description?: string;
  parentId?: string;
}

export interface TopicResponse {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  followersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopicListResponse {
  topics: TopicResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
