import { MCPTool } from '../types/mcp.js';
import { EvolutionApiClient } from '../api/evolution-api.js';

/**
 * Ferramenta MCP para enviar mensagens de texto pelo WhatsApp
 */
export const sendWhatsAppMessage: MCPTool = {
  name: 'sendWhatsAppMessage',
  description: 'Envia uma mensagem de texto para um contato via WhatsApp',
  
  parameters: {
    type: 'object',
    properties: {
      instanceName: {
        type: 'string',
        description: 'Nome da instância do WhatsApp a ser utilizada',
      },
      phoneNumber: {
        type: 'string',
        description: 'Número de telefone do destinatário no formato internacional (com código do país e DDD, sem espaços ou caracteres especiais)',
      },
      message: {
        type: 'string',
        description: 'Texto da mensagem a ser enviada',
      },
    },
    required: ['instanceName', 'phoneNumber', 'message'],
  },
  
  async handler(args: any) {
    const { instanceName, phoneNumber, message } = args;
    try {
      const evolutionApi = new EvolutionApiClient();
      
      // Verificar status da instância antes de enviar
      const statusResponse = await evolutionApi.getInstanceStatus(instanceName);
      if (statusResponse.state !== 'open') {
        return {
          result: {
            success: false,
            message: `A instância "${instanceName}" não está conectada. Status atual: ${statusResponse.state}`,
          }
        };
      }
      
      // Enviar a mensagem
      const result = await evolutionApi.sendText(instanceName, phoneNumber, message);
      
      return {
        result: {
          success: true,
          message: `Mensagem enviada com sucesso para ${phoneNumber}`,
          data: result,
        }
      };
    } catch (error) {
      return {
        result: {
          success: false,
          message: `Erro ao enviar mensagem: ${error instanceof Error ? error.message : String(error)}`,
        }
      };
    }
  },
}; 