import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

// enable CORS
app.use(cors());

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

// This route doesn't need authentication
app.get("/public", function (req: Request, res: Response) {
  console.log("GET /public");
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/private", checkJwt, function (req: Request, res: Response) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});
