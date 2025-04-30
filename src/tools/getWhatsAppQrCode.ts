import { MCPTool } from '../types/mcp.js';
import { EvolutionApiClient } from '../api/evolution-api.js';

/**
 * Ferramenta MCP para obter o QR code de uma instância do WhatsApp
 */
export const getWhatsAppQrCode: MCPTool = {
  name: 'getWhatsAppQrCode',
  description: 'Obtém o QR code para conexão de uma instância do WhatsApp',
  
  parameters: {
    type: 'object',
    properties: {
      instanceName: {
        type: 'string',
        description: 'Nome da instância do WhatsApp',
      },
      timeout: {
        type: 'number',
        description: 'Tempo máximo em segundos para aguardar o QR code (padrão: 60)',
      },
    },
    required: ['instanceName'],
  },
  
  async handler(args: any) {
    const { instanceName, timeout = 60 } = args;
    try {
      const evolutionApi = new EvolutionApiClient();
      
      // Verificar status da instância
      const statusResponse = await evolutionApi.getInstanceStatus(instanceName);
      
      // Se a instância já estiver conectada, não precisa de QR code
      if (statusResponse.state === 'open') {
        return {
          result: {
            success: false,
            message: `A instância "${instanceName}" já está conectada. Não é necessário QR code.`,
          }
        };
      }
      
      // Se não estiver conectada, obter o QR code com timeout
      const startTime = Date.now();
      const maxTime = startTime + (timeout * 1000);
      
      while (Date.now() < maxTime) {
        try {
          const qrCodeResponse = await evolutionApi.getQrCode(instanceName);
          
          return {
            result: {
              success: true,
              message: `QR code obtido com sucesso para a instância "${instanceName}"`,
              data: {
                qrCode: qrCodeResponse.base64,
                pairingCode: qrCodeResponse.pairingCode
              }
            }
          };
        } catch (qrError) {
          // Se falhar, aguardar 3 segundos antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Verificar se o status mudou para conectado
          const currentStatus = await evolutionApi.getInstanceStatus(instanceName);
          if (currentStatus.state === 'open') {
            return {
              result: {
                success: false,
                message: `A instância "${instanceName}" foi conectada durante a espera do QR code.`,
              }
            };
          }
        }
      }
      
      // Se chegou aqui, é porque o timeout foi atingido
      return {
        result: {
          success: false,
          message: `Timeout de ${timeout} segundos atingido ao tentar obter o QR code para a instância "${instanceName}".`,
        }
      };
    } catch (error) {
      return {
        result: {
          success: false,
          message: `Erro ao obter QR code: ${error instanceof Error ? error.message : String(error)}`,
        }
      };
    }
  },
}; 