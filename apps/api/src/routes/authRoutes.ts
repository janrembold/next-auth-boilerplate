import express, { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../environment";
import { generateJwtToken } from "../utils/generateJwtToken";
import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";
import { validateEmail } from "../utils/validateEmail";
import { validatePassword } from "../utils/validatePassword";
import { extractJwtToken } from "../utils/extractJwtToken";

const JWT_COOKIE_NAME = "jwt";
const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
const PASSWORD_SALT_ROUNDS = 10;
const JWT_EXPIRY_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days

export const authRoutes = express.Router();

const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("## jwtAuthenticationMiddleware");
  console.log("cookies", req.cookies);

  const jwt = req.cookies?.[JWT_COOKIE_NAME];
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  const payload = extractJwtToken(jwt as string);
  const userId = payload?.sub;
  const isJwtValid = payload?.exp && payload.exp > Date.now() / 1000;
  const checkRefreshToken = refreshToken && (!userId || !isJwtValid);

  console.log("jwt valid until", new Date((payload?.exp as number) * 1000));

  if (checkRefreshToken) {
    console.log("## checkRefreshToken", isJwtValid, userId);

    const token = await prisma.token.findUnique({
      where: {
        id: refreshToken as string,
      },
    });

    if (token) {
      const deleteToken = prisma.token.delete({
        where: {
          id: refreshToken as string,
        },
      });

      const newToken = prisma.token.create({
        data: {
          userId: token.userId,
          expiration: new Date(
            Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000
          ),
        },
      });

      const [, newRefreshToken] = await prisma.$transaction([
        deleteToken,
        newToken,
      ]);

      const newJwt = generateJwtToken({ id: token.userId }, JWT_EXPIRY_SECONDS);
      addJwtCookieToResponse(res, newJwt, newRefreshToken.id);

      console.log("new tokens generated", newJwt, newRefreshToken.id);

      // req.userId = token.userId;
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "Authentication failed", error: "Invalid token" });
    }
  }

  // req.userId = userId;
  return next();
};

const addJwtCookieToResponse = (
  res: Response,
  jwt: string,
  refreshToken: string
): Response =>
  res
    .cookie(JWT_COOKIE_NAME, jwt, {
      httpOnly: true,
      sameSite: "strict",
      secure: NODE_ENV === "production",
    })
    .cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: NODE_ENV === "production",
    });

authRoutes.post("/auth/password", async (req: Request, res: Response) => {
  console.log("## POST /auth/password", req.user);

  const { email, password } = req.query;
  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  // TODO: check e-mail verification ???

  const isPasswordValid = await bcrypt.compare(
    password as string,
    user?.password as string
  );

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = await prisma.token.create({
    data: {
      userId: user?.id as string,
      expiration: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000),
    },
  });

  const jwt = generateJwtToken(user, JWT_EXPIRY_SECONDS);
  const refreshToken = token.id;

  addJwtCookieToResponse(res, jwt, refreshToken).status(200).json({
    message: "Login successful",
    user: req.user,
    token: jwt,
    refreshToken,
  });
});

authRoutes.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password } = req.query;
  console.log("## POST auth/register", email, password);

  const isEmailValid = validateEmail(email as string);
  const isPasswordValid = validatePassword(password as string);

  if (!isEmailValid) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    PASSWORD_SALT_ROUNDS
  );

  try {
    const user = await prisma.user.create({
      data: {
        email: email as string,
        password: hashedPassword,
        tokens: {
          create: [
            {
              expiration: new Date(
                Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000
              ),
            },
          ],
        },
      },
      include: {
        tokens: true,
      },
    });

    // TODO: send mail with verification link
    // const authId = user.authentications[0].id;
    // const verifyToken = user.authentications[0].verificationToken;
    // const url = "/auth/verify?id=123&token=123";

    const jwt = generateJwtToken(user, JWT_EXPIRY_SECONDS);
    const refreshToken = user.tokens[0].id;

    addJwtCookieToResponse(res, jwt, refreshToken)
      .status(200)
      .json({ message: "User created", user });
  } catch (error) {
    console.log("## error", error);
    return res.status(500).json({ message: "Error creating user" });
  }
});

authRoutes.get("/auth/jwt", jwtMiddleware, (req: Request, res: Response) => {
  console.log("## GET /auth/jwt", req.user);

  res.status(200).json({ message: "Protected route", user: req.user });
});

authRoutes.get("/auth/verify", async (req: Request, res: Response) => {
  console.log("## GET /auth/verify", req.query);

  const { id, token } = req.query;
  // TODO: validate id and token

  const user = await prisma.user.update({
    where: {
      id: id as string,
      verificationToken: token as string,
    },
    data: {
      emailVerified: true,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  res.status(200).json({ message: "E-Mail verification successful" });
});

// logout
authRoutes.get(
  "/auth/logout",
  jwtMiddleware,
  async (req: Request, res: Response) => {
    console.log("## GET /auth/logout", req.user);

    let hasError = true;
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      try {
        await prisma.token.delete({
          where: {
            id: refreshToken,
          },
        });

        hasError = false;
      } catch (error) {
        console.log("## error", error);
      }
    }

    res.clearCookie(JWT_COOKIE_NAME).clearCookie(REFRESH_TOKEN_COOKIE_NAME);

    if (hasError) {
      res.status(200).json({ message: "Logout successful" });
    } else {
      res.status(500).json({ message: "Error logging out user" });
    }
  }
);

// validate email
// forgot password
// reset password
// TODO: remove expired tokens - maybe as batch/cronjob

// TODO: remove this - demo only
authRoutes.get("/protected", jwtMiddleware, (req: Request, res: Response) => {
  res.status(200).json({
    message: "Protected response successful (jwt auth)",
    user: req.user,
  });
});
