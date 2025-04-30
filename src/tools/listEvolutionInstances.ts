import { MCPTool } from '../types/mcp.js';
import { EvolutionApiClient } from '../api/evolution-api.js';

/**
 * Ferramenta MCP para listar todas as instâncias do Evolution API
 */
export const listEvolutionInstances: MCPTool = {
  name: 'listEvolutionInstances',
  description: 'Lista todas as instâncias do WhatsApp disponíveis na Evolution API',
  
  parameters: {
    type: 'object',
    properties: {},
    required: [],
  },
  
  async handler() {
    try {
      const evolutionApi = new EvolutionApiClient();
      const instances = await evolutionApi.listInstances();
      
      return {
        result: {
          success: true,
          message: 'Instâncias listadas com sucesso',
          data: instances,
        }
      };
    } catch (error) {
      return {
        result: {
          success: false,
          message: `Erro ao listar instâncias: ${error instanceof Error ? error.message : String(error)}`,
        }
      };
    }
  },
}; 