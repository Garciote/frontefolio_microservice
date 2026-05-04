require('dotenv').config();
const app = require('./src/app');
const db  = require('./src/db/connection');

const PORT = process.env.PORT || 3003;

async function start() {
  try {
    await db.query('SELECT 1');
    console.log('[catalog-service] Base de datos conectada');
    app.listen(PORT, () => console.log(`[catalog-service] corriendo en http://localhost:${PORT}`));
  } catch (err) {
    console.error('[catalog-service] No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  }
}

start();
