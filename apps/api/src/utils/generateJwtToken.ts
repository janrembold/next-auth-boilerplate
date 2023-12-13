import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../environment";

export const generateJwtToken = (user: any, expiresInSeconds: number) => {
  const payload = { sub: user.id };

  // TODO: add secret key
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresInSeconds,
  });
};
