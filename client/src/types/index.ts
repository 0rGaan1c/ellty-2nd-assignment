export interface Thread {
  id: number;
  value: number;
  operation: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | null;
  rightOperand: number | null;
  parentId: number | null;
  userId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
  _count: {
    replies: number;
  };
}

export interface AuthResponse {
  username: string;
  token: string;
}

export interface ApiResult<T> {
  success: boolean;
  data: T | null;
  error: any;
}
