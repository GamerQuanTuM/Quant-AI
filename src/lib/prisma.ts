import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../../generated/prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export const healthCheck = async (): Promise<boolean> => {
  try {
    console.log('Performing Postgres health check...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('Postgres health check passed');
    return true;
  } catch (error) {
    console.error('Postgres health check failed:', error);
    return false;
  }
};