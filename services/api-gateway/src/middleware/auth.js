const jwt = require('jsonwebtoken');

function injectUser(req, res, next) {
  // Eliminar headers que el cliente podría intentar inyectar
  delete req.headers['x-user-id'];
  delete req.headers['x-user-role'];

  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.headers['x-user-id']   = String(payload.id);
    req.headers['x-user-role'] = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { injectUser };
