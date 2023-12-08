import { NextRequest, NextResponse } from "next/server";
import { touchSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  await touchSession(req, res);
  return res;
}
