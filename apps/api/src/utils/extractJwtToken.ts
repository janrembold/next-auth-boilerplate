import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../environment";

export const extractJwtToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: true,
    }) as JwtPayload;
  } catch (error) {
    return null;
  }
};
