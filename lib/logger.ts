import prisma from '@/lib/prisma';

export async function logActivity(userId: number, action: string, details?: string) {
  try {
    await prisma.systemLog.create({
      data: {
        userId,
        action,
        details
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
