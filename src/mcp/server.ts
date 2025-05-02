import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createEvolutionInstance, getWhatsAppQrCode, listEvolutionInstances, sendWhatsAppMessage } from '../tools/index.js';
import { MCPPrompt, MCPResource, MCPTool, MCPToolRequest } from '../types/mcp.js';
import { apiKeyMiddleware } from '../middleware/auth.js';
import { sseMiddleware } from '../middleware/sse.js';
import { sseManager } from '../utils/sse.js';

/**
 * Classe que implementa um servidor MCP (Model Context Protocol)
 */
export class MCPServer {
  private app: Express;
  private tools: MCPTool[] = [];
  private resources: Record<string, MCPResource> = {};
  private prompts: Record<string, MCPPrompt> = {};
  private serverConfig: {
    title: string;
    description: string;
    version: string;
  };

  constructor(config: {
    title: string;
    description: string;
    version: string;
  }) {
    this.app = express();
    this.serverConfig = config;
    
    // Configurar middleware
    // Habilitar CORS para todas as origens
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
    }));
    this.app.use(express.json());
    
    // Configurar rotas MCP
    this.setupRoutes();
  }

  /**
   * Adiciona ferramentas ao servidor
   */
  addTools(tools: MCPTool[]): void {
    this.tools.push(...tools);
  }

  /**
   * Adiciona recursos ao servidor
   */
  addResources(resources: Record<string, MCPResource>): void {
    this.resources = { ...this.resources, ...resources };
  }

  /**
   * Adiciona prompts ao servidor
   */
  addPrompts(prompts: Record<string, MCPPrompt>): void {
    this.prompts = { ...this.prompts, ...prompts };
  }

  /**
   * Configura as rotas para o protocolo MCP
   */
  private setupRoutes(): void {
    // Rota de inicialização (sem proteção)
    this.app.post('/initialize', (req: Request, res: Response) => {
      const response = {
        protocol: {
          version: '2025-03-26'
        },
        server: this.serverConfig
      };
      res.json(response);
    });

    // Rota para teste de conexão - útil para verificar se o servidor está acessível
    this.app.get('/ping', (_req: Request, res: Response) => {
      res.json({ status: 'ok', message: 'Servidor MCP está online' });
    });

    // Endpoint SSE para eventos em tempo real
    this.app.get('/events', apiKeyMiddleware, sseMiddleware, (_req: Request, res: Response) => {
      // Se chegou aqui, é porque a solicitação não era para SSE
      res.status(400).json({ 
        error: { message: 'Este endpoint é apenas para conexões SSE. Use ?stream=true ou Accept: text/event-stream' } 
      });
    });

    // Rotas protegidas por autenticação via API Key
    // Rota para listar recursos
    this.app.get('/resources', apiKeyMiddleware, (_req: Request, res: Response) => {
      res.json({ resources: this.resources });
    });

    // Rota para listar ferramentas
    this.app.get('/tools', apiKeyMiddleware, (_req: Request, res: Response) => {
      // Removemos o handler das ferramentas para não expor a implementação
      const toolsWithoutHandlers = this.tools.map(({ name, description, parameters }) => {
        return { name, description, parameters };
      });
      res.json({ tools: toolsWithoutHandlers });
    });

    // Rota para listar prompts
    this.app.get('/prompts', apiKeyMiddleware, (_req: Request, res: Response) => {
      res.json({ prompts: this.prompts });
    });

    // Rota para executar ferramentas com suporte a SSE para streaming de resultados
    this.app.post('/tools/:name', apiKeyMiddleware, sseMiddleware, async (req: Request, res: Response) => {
      const { name } = req.params;
      const parameters = req.body.parameters || {};
      const sseConnection = (req as any).sseConnection;

      const tool = this.tools.find(t => t.name === name);
      
      if (!tool) {
        if (sseConnection) {
          sseConnection.send('error', { message: `Ferramenta "${name}" não encontrada` });
          return;
        }
        return res.status(404).json({
          error: {
            message: `Ferramenta "${name}" não encontrada`
          }
        });
      }

      try {
        // Notificar início da execução se estiver usando SSE
        if (sseConnection) {
          sseConnection.send('executing', { 
            tool: name,
            status: 'started',
            parameters 
          });
        }

        // Executar a ferramenta
        const result = await tool.handler(parameters);
        
        // Enviar o resultado
        if (sseConnection) {
          sseConnection.send('result', result);
          sseConnection.send('complete', { status: 'success' });
          // Não fechamos a conexão aqui para permitir mais eventos
        } else {
          res.json(result);
        }
      } catch (error) {
        console.error(`Erro ao executar ferramenta ${name}:`, error);
        
        if (sseConnection) {
          sseConnection.send('error', { 
            message: `Erro ao executar ferramenta: ${error instanceof Error ? error.message : String(error)}` 
          });
        } else {
          res.status(500).json({
            error: {
              message: `Erro ao executar ferramenta: ${error instanceof Error ? error.message : String(error)}`
            }
          });
        }
      }
    });
  }

  /**
   * Inicia o servidor na porta especificada
   */
  listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      const server = this.app.listen(port, '0.0.0.0', () => {
        console.log(`Servidor escutando em http://0.0.0.0:${port}`);
        resolve();
      });
      
      // Configurar desligamento gracioso
      process.on('SIGINT', () => this.shutdown(server));
      process.on('SIGTERM', () => this.shutdown(server));
    });
  }

  /**
   * Desliga o servidor de forma graciosa
   */
  private shutdown(server: any): void {
    console.log('Desligando servidor...');
    
    // Fechar todas as conexões SSE
    sseManager.closeAllConnections();
    
    // Fechar o servidor
    server.close(() => {
      console.log('Servidor encerrado');
      process.exit(0);
    });
    
    // Se o servidor não fechar em 5 segundos, forçar o encerramento
    setTimeout(() => {
      console.error('Encerramento forçado após timeout');
      process.exit(1);
    }, 5000);
  }
}

/**
 * Cria e configura o servidor MCP
 */
export function createMcpServer(): MCPServer {
  // Criar uma nova instância do servidor MCP
  const server = new MCPServer({
    title: 'Evolution WhatsApp API',
    description: 'Servidor MCP para interação com a Evolution API do WhatsApp',
    version: '1.0.0',
  });

  // Adicionar recursos
  server.addResources({
    // Informações sobre WhatsApp
    whatsapp: {
      description: 'Recursos relacionados ao WhatsApp e à Evolution API',
    },
  });

  // Adicionar ferramentas
  server.addTools([
    // Instâncias do WhatsApp
    createEvolutionInstance,
    listEvolutionInstances,
    getWhatsAppQrCode,
    
    // Mensagens
    sendWhatsAppMessage,
  ]);

  // Adicionar prompts (modelos de prompt predefinidos)
  server.addPrompts({
    'criar-nova-instancia': {
      name: 'Criar nova instância do WhatsApp',
      description: 'Cria uma nova instância do WhatsApp na Evolution API',
      prompt: `Crie uma nova instância do WhatsApp com o nome {instanceName}.
Por favor, use apenas letras, números e underscore no nome da instância.`,
      inputSchema: {
        type: 'object',
        properties: {
          instanceName: {
            type: 'string',
            description: 'Nome para a nova instância',
          },
        },
        required: ['instanceName'],
      },
    },
    'enviar-mensagem': {
      name: 'Enviar mensagem de WhatsApp',
      description: 'Envia uma mensagem para um contato via WhatsApp',
      prompt: `Envie a mensagem "{message}" para o número {phoneNumber} usando a instância {instanceName} do WhatsApp.
O número de telefone deve estar no formato internacional, com código do país e DDD, sem espaços ou caracteres especiais.`,
      inputSchema: {
        type: 'object',
        properties: {
          instanceName: {
            type: 'string',
            description: 'Nome da instância a ser usada',
          },
          phoneNumber: {
            type: 'string',
            description: 'Número de telefone do destinatário',
          },
          message: {
            type: 'string',
            description: 'Texto da mensagem',
          },
        },
        required: ['instanceName', 'phoneNumber', 'message'],
      },
    },
  });

  return server;
} 