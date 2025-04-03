import { ApiResult, AuthResponse } from "../types";
import api from "./index";

export const login = async (
  username: string,
  password: string
): Promise<ApiResult<AuthResponse>> => {
  try {
    const response = await api.post("/auth/session", { username, password });
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
