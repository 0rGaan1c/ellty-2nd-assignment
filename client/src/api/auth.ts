import api from "./index";

export interface AuthResponse {
  userId: number;
  username: string;
  token: string;
}

export interface ApiResult<T> {
  success: boolean;
  data: T | null;
  error: any;
}

export const login = async (
  username: string,
  password: string
): Promise<ApiResult<AuthResponse>> => {
  try {
    const response = await api.post("/auth/session", { username, password });
    return { success: true, data: response.data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
