import { createContext } from "react";
import { ApiResult, AuthResponse } from "../types";

type AuthContextType = {
  user: AuthResponse | null;
  login: (
    username: string,
    password: string
  ) => Promise<ApiResult<AuthResponse>>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
