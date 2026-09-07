import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export async function getNotifications(req: Request, res: Response) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return res.json(updated);
  } catch (error: any) {
    console.error('Error marking notification read:', error);
    return res.status(500).json({ error: 'Failed to mark notification read' });
  }
}

export async function markAllAsRead(req: Request, res: Response) {
  try {
    await prisma.notification.updateMany({
      data: { read: true },
    });
    return res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    console.error('Error marking all notifications read:', error);
    return res.status(500).json({ error: 'Failed to mark all as read' });
  }
}
