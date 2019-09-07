export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  points: number;
}

export interface UserResponse {
  user: User;
}