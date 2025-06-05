// <project-root>/prisma/index.ts
import { PrismaClient } from "@prisma/client";

// (optional) Prevent multiple instantiations in development
declare global {
    var __prisma: PrismaClient | undefined;
}
const prisma =
    global.__prisma ||
    new PrismaClient({
        log: ["query", "error", "warn", "info"],
    });
if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export { prisma };
