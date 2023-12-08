import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await prisma.user.findUnique({
    where: {
      id: "12345678abc",
    },
  });

  return NextResponse.json(user || { message: "no user found" });
};
