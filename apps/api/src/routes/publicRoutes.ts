import express, { Request, Response } from "express";

export const publicRoutes = express.Router();

publicRoutes.get("/", function (_req: Request, res: Response) {
  console.log("GET /public");
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});
