import { useState } from "react";
import { login as loginApi } from "../api/auth";
import { ApiResult, AuthResponse } from "../types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (
    username: string,
    password: string
  ): Promise<ApiResult<AuthResponse>> => {
    const result = await loginApi(username, password);

    if (result.success && result.data) {
      setUser(result.data);
      localStorage.setItem("user", JSON.stringify(result.data));

      if (result.data.token) {
        localStorage.setItem("token", result.data.token);
      }
    }

    return result;
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
