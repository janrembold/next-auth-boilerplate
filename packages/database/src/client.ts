import { PrismaClient } from '@prisma/client';

declare global {
  const prisma: PrismaClient | undefined;
}

export const prisma = (global as any).prisma || new PrismaClient();

// eslint-disable-next-line turbo/no-undeclared-env-vars
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma;

export * from '@prisma/client';
