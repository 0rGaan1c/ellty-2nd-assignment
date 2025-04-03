export const authConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "30d" as const,
  cookieName: "token"
};
