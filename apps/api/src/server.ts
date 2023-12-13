import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { publicRoutes } from "./routes/publicRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { authRoutes } from "./routes/authRoutes";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.disable("x-powered-by");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/", publicRoutes);
app.use("/", authRoutes);
app.use("/", protectedRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log("## 404 error handler");
  next(createError(404));
});

app.use((err: any, _req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV !== "production";
  console.log("## general error handler", err);

  res
    .status(err.status || 500)
    .json({ message: isProduction ? "Error" : err.message });
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});
