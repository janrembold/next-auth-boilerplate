import express, { Request, Response } from "express";

export const protectedRoutes = express.Router();

protectedRoutes.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

protectedRoutes.get("/protected", function (req: Request, res: Response) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});
