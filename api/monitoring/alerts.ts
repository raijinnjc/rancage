import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.status(200).json([
    {
      id: 'alt_001',
      title: 'Critical Exclusion Gap',
      message:
        'Kabupaten Sukabumi PKH targeting reports a high exclusion rate (+11.8%).',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'alt_002',
      title: 'Food Price Index Spike',
      message:
        'Kota Tasikmalaya food staple baskets climbed 14.2% above baseline thresholds.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'alt_003',
      title: 'Survey Infiltration Log',
      message:
        'Indramayu data collection synchronization successfully logged.',
      severity: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
  ]);
}
