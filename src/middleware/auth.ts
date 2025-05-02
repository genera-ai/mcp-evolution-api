import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from '../api/auth.js';

/**
 * Middleware para verificar a chave API
 */
export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Verificar a chave API no cabeçalho ou como parâmetro de consulta
  const headerApiKey = req.headers['x-api-key'] as string;
  const queryApiKey = req.query.apiKey as string;
  const apiKey = headerApiKey || queryApiKey;
  
  if (!apiKey || !validateApiKey(apiKey)) {
    res.status(401).json({ error: { message: 'Chave API inválida ou não fornecida' } });
    return;
  }
  
  // Continua para o próximo middleware ou controlador
  next();
} 