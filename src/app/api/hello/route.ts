import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ name: "Hello Getto" });
}

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;

  if (!id) {
    return NextResponse.json({ error: "error msg" }, { status: 404 });
  }

  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  console.log("hello", { id, name: result?.name });
  return NextResponse.json({ name: result?.name });
}
