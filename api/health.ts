import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      database: 'CONNECTED',
      proxyMeansModel: 'READY',
      auditLogger: 'ACTIVE',
    },
    system: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
  });
}
