export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  role: "root" | "admin" | "employee" | "user";
  status: "active" | "inactive" | "banned";
  emailVerified: boolean;
  lastLogin?: Date;
  postsCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role?: "root" | "admin" | "employee" | "user";
}

export interface UserUpdateDto {
  username?: string;
  email?: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  role?: "root" | "admin" | "employee" | "user";
  status?: "active" | "inactive" | "banned";
  emailVerified?: boolean;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  role: "root" | "admin" | "employee" | "user";
  status: "active" | "inactive" | "banned";
  emailVerified: boolean;
  lastLogin?: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuthResponse {
  user: UserResponse;
  token: string;
}

export interface UserState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
}
