import express, { Request, Response } from "express";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import cors from "cors";

const port = process.env.PORT || 4000;
const app = express();

// enable CORS
app.use(cors());

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://jr-freelance.eu.auth0.com/api/v2/",
  issuerBaseURL: `https://jr-freelance.eu.auth0.com`,
});

// This route doesn't need authentication
app.get("/api/public", function (req: Request, res: Response) {
  console.log("GET /public");
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/api/private", checkJwt, function (req: Request, res: Response) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

const checkScopes = requiredScopes("read:messages");

app.get(
  "/api/private-scoped",
  checkJwt,
  checkScopes,
  function (req: Request, res: Response) {
    res.json({
      message:
        "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
    });
  }
);

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});
