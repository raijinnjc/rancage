import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.status(200).json([
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(
        'id-ID'
      ),
      userId: 'usr_bapp_01',
      actionEvent: 'Export Household Microdata',
      statusCode: '200_SUCCESS',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 24).toLocaleTimeString(
        'id-ID'
      ),
      userId: 'usr_dsos_04',
      actionEvent: 'Modify PMT Threshold Value',
      statusCode: '200_SUCCESS',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 58).toLocaleTimeString(
        'id-ID'
      ),
      userId: 'anonymous_user',
      actionEvent: 'Restricted Microdata Access Attempt',
      statusCode: '403_FORBIDDEN',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString(
        'id-ID'
      ),
      userId: 'usr_sys_admin',
      actionEvent: 'Calibrate Proxy Means Model',
      statusCode: '200_SUCCESS',
    },
  ]);
}
