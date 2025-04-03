export interface User {
  id: number;
  username: string;
}

export interface Thread {
  id: number;
  value: number;
  operation?: string;
  rightOperand?: number;
  parentId?: number;
  userId: number;
  createdAt: string;
  user?: User;
  replies?: Thread[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
