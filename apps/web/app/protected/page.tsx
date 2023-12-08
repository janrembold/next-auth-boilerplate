/* eslint-disable turbo/no-undeclared-env-vars */
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { SessionData } from "../../components/SessionData";

export default withPageAuthRequired(
  async function Page() {
    return <SessionData />;
  },
  { returnTo: "/" }
);
