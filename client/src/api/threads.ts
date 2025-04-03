import { ApiResult, Thread } from "../types";
import api from "./index";

export const getThreads = async (): Promise<ApiResult<Thread[]>> => {
  try {
    const response = await api.get("/threads");
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const getThreadReplies = async (
  threadId: number
): Promise<ApiResult<Thread[]>> => {
  try {
    const response = await api.get(`/threads/${threadId}/replies`);
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const createThread = async (
  value: number
): Promise<ApiResult<Thread>> => {
  try {
    const response = await api.post("/threads", { value });
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const createReply = async (
  threadId: number,
  operation: string,
  rightOperand: number
): Promise<ApiResult<Thread>> => {
  try {
    const response = await api.post(`/threads/${threadId}/replies`, {
      operation,
      rightOperand
    });
    return { success: true, data: response.data.data, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};
