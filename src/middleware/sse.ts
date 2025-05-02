import { Request, Response, NextFunction } from 'express';
import { sseManager } from '../utils/sse.js';

/**
 * Middleware para configurar o streaming SSE
 */
export function sseMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Verificar se o cliente solicitou streaming SSE
  const enableStreaming = req.query.stream === 'true' || req.headers['accept'] === 'text/event-stream';
  
  if (enableStreaming) {
    // Configurar SSE para esta solicitação
    const clientId = req.query.clientId as string || undefined;
    const connection = sseManager.createConnection(res, clientId);
    
    // Armazenar a conexão no objeto de solicitação para uso posterior
    (req as any).sseConnection = connection;
    
    // Enviar evento inicial
    connection.send('start', { message: 'Conexão SSE estabelecida com sucesso' });
  } else {
    // Continuar com o fluxo normal
    next();
  }
} 