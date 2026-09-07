import { Request, Response } from 'express';
import { seedDemoData } from '../db/seed';

export async function resetAndSeedDemo(req: Request, res: Response) {
  try {
    await seedDemoData();
    return res.json({ message: 'Demo dataset loaded successfully! Dashboard updated.' });
  } catch (error: any) {
    console.error('Error seeding demo data via API:', error);
    return res.status(500).json({ error: 'Failed to reset demo dataset' });
  }
}
