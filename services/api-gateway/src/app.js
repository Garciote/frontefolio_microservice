require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { injectUser } = require('./middleware/auth');

const app = express();

const S = {
  auth:      process.env.AUTH_SERVICE_URL      || 'http://localhost:3001',
  users:     process.env.USER_SERVICE_URL      || 'http://localhost:3002',
  catalog:   process.env.CATALOG_SERVICE_URL   || 'http://localhost:3003',
  orders:    process.env.ORDER_SERVICE_URL     || 'http://localhost:3004',
  payments:  process.env.PAYMENT_SERVICE_URL   || 'http://localhost:3005',
  logistics: process.env.LOGISTICS_SERVICE_URL || 'http://localhost:3006',
  chat:      process.env.CHAT_SERVICE_URL      || 'http://localhost:3007',
};

app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_CUSTOMER_URL || 'http://localhost:5173',
    process.env.FRONTEND_ADMIN_URL    || 'http://localhost:5174',
  ],
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const proxy = (target) => createProxyMiddleware({ target, changeOrigin: true });

app.use('/api/auth',      injectUser, proxy(S.auth));
app.use('/api/inventory', injectUser, proxy(S.catalog));
app.use('/api/categories',injectUser, proxy(S.catalog));
app.use('/api/countries', injectUser, proxy(S.catalog));
app.use('/api/suppliers', injectUser, proxy(S.catalog));
app.use('/api/customers', injectUser, proxy(S.users));
app.use('/api/staff',     injectUser, proxy(S.users));
app.use('/api/orders',    injectUser, proxy(S.orders));
app.use('/api/offers',    injectUser, proxy(S.orders));
app.use('/api/payments',  injectUser, proxy(S.payments));
app.use('/api/shipments', injectUser, proxy(S.logistics));
app.use('/api/chat',      injectUser, proxy(S.chat));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` }));

module.exports = app;
