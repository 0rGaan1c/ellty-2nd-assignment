export const authConfig = {
  secret: process.env.JWT_SECRET || "fadjskfajsdfklasdjfalskdjfasddkfj",
  expiresIn: 30,
  cookieName: "token"
};
