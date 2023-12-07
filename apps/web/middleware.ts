import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import { touchSession } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired(async function middleware(req) {
  console.log("middleware fired");
  const res = NextResponse.next();
  // const res = new NextResponse();
  // await touchSession(req, res);
  // const user = await getSession(req, res);
  // res.cookies.set("hl", user.language);
  return res;
  // return NextResponse.redirect(new URL("/", req.url), res);
});

export const config = {
  matcher: "/middleware/:path*",
};
