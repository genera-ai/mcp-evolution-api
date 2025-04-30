import { MCPTool } from '../types/mcp.js';
import { EvolutionApiClient } from '../api/evolution-api.js';

/**
 * Ferramenta MCP para criar uma nova instância do Evolution API
 */
export const createEvolutionInstance: MCPTool = {
  name: 'createEvolutionInstance',
  description: 'Cria uma nova instância do WhatsApp na Evolution API',
  
  parameters: {
    type: 'object',
    properties: {
      instanceName: {
        type: 'string',
        description: 'Nome para a nova instância. Use apenas letras, números e underscore.',
      },
    },
    required: ['instanceName'],
  },
  
  async handler(args: any) {
    const { instanceName } = args;
    try {
      const evolutionApi = new EvolutionApiClient();
      const result = await evolutionApi.createInstance(instanceName);
      
      return {
        result: {
          success: true,
          message: `Instância "${instanceName}" criada com sucesso`,
          data: result,
        }
      };
    } catch (error) {
      return {
        result: {
          success: false,
          message: `Erro ao criar instância: ${error instanceof Error ? error.message : String(error)}`,
        }
      };
    }
  },
}; 