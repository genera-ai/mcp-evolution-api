import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from '../api/auth.js';

/**
 * Middleware para verificar a chave API
 */
export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey || !validateApiKey(apiKey)) {
    res.status(401).json({ error: { message: 'Chave API inválida ou não fornecida' } });
    return;
  }
  
  // Continua para o próximo middleware ou controlador
  next();
} 