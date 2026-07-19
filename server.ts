import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use json parser for API bodies
  app.use(express.json());

  // ==========================================
  // Backend API Route Handlers (Data Layer Access)
  // ==========================================

  // 1. System Health Status Indicator
  app.get('/api/health', (req, res) => {
    res.json({
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
  });

  // 2. Early Warning System (EWS) Alert Feeds
  app.get('/api/monitoring/alerts', (req, res) => {
    res.json([
      {
        id: 'alt_001',
        title: 'Critical Exclusion Gap',
        message: 'Kabupaten Sukabumi PKH targeting reports a high exclusion rate (+11.8%).',
        severity: 'critical',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
      },
      {
        id: 'alt_002',
        title: 'Food Price Index Spike',
        message: 'Kota Tasikmalaya food staple baskets climbed 14.2% above baseline thresholds.',
        severity: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
      },
      {
        id: 'alt_003',
        title: 'Survey Infiltration Log',
        message: 'Indramayu data collection synchronization successfully logged.',
        severity: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5h ago
      },
    ]);
  });

  // 3. Security Audit Logs Feed
  app.get('/api/admin/audit-logs', (req, res) => {
    res.json([
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString('id-ID'),
        userId: 'usr_bapp_01',
        actionEvent: 'Export Household Microdata',
        statusCode: '200_SUCCESS',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 24).toLocaleTimeString('id-ID'),
        userId: 'usr_dsos_04',
        actionEvent: 'Modify PMT Threshold Value',
        statusCode: '200_SUCCESS',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 58).toLocaleTimeString('id-ID'),
        userId: 'anonymous_user',
        actionEvent: 'Restricted Microdata Access Attempt',
        statusCode: '403_FORBIDDEN',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString('id-ID'),
        userId: 'usr_sys_admin',
        actionEvent: 'Calibrate Proxy Means Model',
        statusCode: '200_SUCCESS',
      },
    ]);
  });

  // ==========================================
  // Vite Dev Server / Static Production Serving
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware so Express serves assets with HMR and fast compilation
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve pre-compiled static files produced by 'npm run build' inside dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Handle single-page application fallback routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RANCAGE Backend] Service running on http://0.0.0.0:${PORT}`);
    console.log(`[RANCAGE Backend] Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
