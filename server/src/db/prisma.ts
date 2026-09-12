import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

let dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

// Handle read-only serverless filesystems (e.g. Vercel, AWS Lambda)
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpDbPath = path.join('/tmp', 'dev.db');
  const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log('Successfully copied SQLite dev.db to writeable /tmp/dev.db');
      } else {
        console.log('Source dev.db not found, creating new SQLite database at /tmp/dev.db');
      }
    }
    dbUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = dbUrl;
  } catch (err) {
    console.warn('Notice: Could not prepare /tmp/dev.db SQLite copy:', err);
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
