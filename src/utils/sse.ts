import { Response } from 'express';

/**
 * Classe para gerenciar uma conexão SSE (Server-Sent Events)
 */
export class SSEConnection {
  private res: Response;
  private clientId: string;
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private closed = false;

  /**
   * Cria uma nova conexão SSE
   * @param res - Objeto de resposta Express
   * @param clientId - ID único para este cliente
   */
  constructor(res: Response, clientId: string) {
    this.res = res;
    this.clientId = clientId;
    
    // Configurar cabeçalhos para SSE
    this.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Desativar buffering para Nginx
    });

    // Iniciar heartbeat para manter a conexão ativa
    this.startHeartbeat();
    
    // Manipular desconexão do cliente
    this.res.on('close', () => {
      this.close();
    });
  }

  /**
   * Envia um evento para o cliente
   * @param eventType - Tipo do evento
   * @param data - Dados a serem enviados
   */
  send(eventType: string, data: any): void {
    if (this.closed) return;
    
    try {
      this.res.write(`event: ${eventType}\n`);
      this.res.write(`data: ${JSON.stringify(data)}\n\n`);
      this.res.flushHeaders();
    } catch (error) {
      console.error(`Erro ao enviar evento SSE para cliente ${this.clientId}:`, error);
      this.close();
    }
  }

  /**
   * Envia uma mensagem de heartbeat para manter a conexão ativa
   */
  private sendHeartbeat(): void {
    if (this.closed) return;
    
    try {
      this.res.write(': heartbeat\n\n');
      this.res.flushHeaders();
    } catch (error) {
      console.error(`Erro ao enviar heartbeat para cliente ${this.clientId}:`, error);
      this.close();
    }
  }

  /**
   * Inicia o envio periódico de heartbeat
   */
  private startHeartbeat(): void {
    this.keepAliveInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // A cada 30 segundos
  }

  /**
   * Fecha a conexão SSE
   */
  close(): void {
    if (this.closed) return;
    
    this.closed = true;
    
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    
    try {
      this.res.end();
    } catch (error) {
      console.error(`Erro ao fechar conexão SSE para cliente ${this.clientId}:`, error);
    }
    
    console.log(`Conexão SSE fechada para cliente ${this.clientId}`);
  }

  /**
   * Verifica se a conexão está fechada
   */
  isClosed(): boolean {
    return this.closed;
  }

  /**
   * Retorna o ID do cliente
   */
  getClientId(): string {
    return this.clientId;
  }
}

/**
 * Gerenciador de conexões SSE
 */
export class SSEManager {
  private static instance: SSEManager;
  private connections: Map<string, SSEConnection> = new Map();

  /**
   * Obtém a instância singleton do gerenciador
   */
  static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  /**
   * Cria uma nova conexão SSE
   * @param res - Objeto de resposta Express
   * @param clientId - ID opcional do cliente (gera um UUID se não fornecido)
   * @returns A conexão SSE criada
   */
  createConnection(res: Response, clientId?: string): SSEConnection {
    const id = clientId || this.generateClientId();
    const connection = new SSEConnection(res, id);
    
    this.connections.set(id, connection);
    console.log(`Nova conexão SSE estabelecida: ${id}`);
    
    return connection;
  }

  /**
   * Obtém uma conexão existente pelo ID do cliente
   * @param clientId - ID do cliente
   * @returns A conexão SSE ou undefined se não encontrada
   */
  getConnection(clientId: string): SSEConnection | undefined {
    return this.connections.get(clientId);
  }

  /**
   * Remove uma conexão do gerenciador
   * @param clientId - ID do cliente
   */
  removeConnection(clientId: string): void {
    const connection = this.connections.get(clientId);
    
    if (connection) {
      if (!connection.isClosed()) {
        connection.close();
      }
      
      this.connections.delete(clientId);
      console.log(`Conexão SSE removida: ${clientId}`);
    }
  }

  /**
   * Fecha todas as conexões
   */
  closeAllConnections(): void {
    this.connections.forEach((connection) => {
      connection.close();
    });
    
    this.connections.clear();
    console.log('Todas as conexões SSE foram fechadas');
  }

  /**
   * Gera um ID único para o cliente
   */
  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Exporta a instância singleton
export const sseManager = SSEManager.getInstance(); 