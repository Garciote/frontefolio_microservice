function authenticate(req, res, next) {
  const userId   = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  if (!userId || !userRole) return res.status(401).json({ error: 'No autenticado' });
  req.user = { id: parseInt(userId), role: userRole };
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Acceso denegado' });
    next();
  };
}

module.exports = { authenticate, authorize };
