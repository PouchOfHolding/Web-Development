import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../../../shared/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_book_store_2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

//Middleware que interceta o cabeçalho Authorization: Bearer <token> e valida a assinatura JWT.

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // 6.1. Obter o cabeçalho 'authorization' do pedido
  const authHeader = req.headers['authorization'];

  // 6.2. Se o cabeçalho estiver ausente ou não começar com 'Bearer ', responde 401 Unauthorized
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token ausente ou formato inválido.' });
  }

  // 6.3. Extrair a string do token removendo o prefixo 'Bearer '
  const token = authHeader.split(' ')[1];

  try {
    // 6.3 & 6.5. Validar a assinatura com jwt.verify e decifrar o payload
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest['user'];

    // 6.5. Anexar o payload descodificado a req.user e invocar next()
    req.user = decoded;
    next();
  } catch (error) {
    // 6.4. Se o token for inválido ou tiver expirado, responde 403 Forbidden
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

/**
 * Middleware para restrição de rotas com base no papel (RBAC).
 */
export const requireRole = (requiredRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Verificar se req.user existe e se o seu role corresponde ao exigido (ex: 'admin')
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }
    next();
  };
};