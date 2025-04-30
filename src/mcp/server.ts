import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createEvolutionInstance, getWhatsAppQrCode, listEvolutionInstances, sendWhatsAppMessage } from '../tools/index.js';
import { MCPPrompt, MCPResource, MCPTool, MCPToolRequest } from '../types/mcp.js';

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
    this.app.use(cors());
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
    // Rota de inicialização
    this.app.post('/initialize', (req: Request, res: Response) => {
      const response = {
        protocol: {
          version: '2025-03-26'
        },
        server: this.serverConfig
      };
      res.json(response);
    });

    // Rota para listar recursos
    this.app.get('/resources', (_req: Request, res: Response) => {
      res.json({ resources: this.resources });
    });

    // Rota para listar ferramentas
    this.app.get('/tools', (_req: Request, res: Response) => {
      // Removemos o handler das ferramentas para não expor a implementação
      const toolsWithoutHandlers = this.tools.map(({ name, description, parameters }) => {
        return { name, description, parameters };
      });
      res.json({ tools: toolsWithoutHandlers });
    });

    // Rota para listar prompts
    this.app.get('/prompts', (_req: Request, res: Response) => {
      res.json({ prompts: this.prompts });
    });

    // Rota para executar ferramentas
    this.app.post('/tools/:name', async (req: Request, res: Response) => {
      const { name } = req.params;
      const parameters = req.body.parameters || {};

      const tool = this.tools.find(t => t.name === name);
      
      if (!tool) {
        return res.status(404).json({
          error: {
            message: `Ferramenta "${name}" não encontrada`
          }
        });
      }

      try {
        const result = await tool.handler(parameters);
        res.json(result);
      } catch (error) {
        console.error(`Erro ao executar ferramenta ${name}:`, error);
        res.status(500).json({
          error: {
            message: `Erro ao executar ferramenta: ${error instanceof Error ? error.message : String(error)}`
          }
        });
      }
    });
  }

  /**
   * Inicia o servidor na porta especificada
   */
  listen(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        resolve();
      });
    });
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