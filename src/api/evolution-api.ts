import axios, { AxiosInstance } from 'axios';
import { config } from '../config.js';

/**
 * Cliente para interação com a Evolution API
 */
export class EvolutionApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.evolutionApi.url,
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.evolutionApi.key
      }
    });
  }

  /**
   * Lista todas as instâncias disponíveis
   */
  async listInstances() {
    try {
      const response = await this.api.get('/instance/fetchInstances');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar instâncias:', error);
      throw new Error(`Falha ao listar instâncias: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Cria uma nova instância
   */
  async createInstance(instanceName: string) {
    try {
      const response = await this.api.post('/instance/create', {
        instanceName
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao criar instância ${instanceName}:`, error);
      throw new Error(`Falha ao criar instância: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Conecta uma instância
   */
  async connectInstance(instanceName: string) {
    try {
      const response = await this.api.post(`/instance/connect/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao conectar instância ${instanceName}:`, error);
      throw new Error(`Falha ao conectar instância: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Desconecta uma instância
   */
  async disconnectInstance(instanceName: string) {
    try {
      const response = await this.api.post(`/instance/disconnect/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao desconectar instância ${instanceName}:`, error);
      throw new Error(`Falha ao desconectar instância: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Deleta uma instância
   */
  async deleteInstance(instanceName: string) {
    try {
      const response = await this.api.delete(`/instance/delete/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar instância ${instanceName}:`, error);
      throw new Error(`Falha ao deletar instância: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Verifica o status da conexão de uma instância
   */
  async getInstanceStatus(instanceName: string) {
    try {
      const response = await this.api.get(`/instance/connectionState/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao verificar status da instância ${instanceName}:`, error);
      throw new Error(`Falha ao verificar status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Obtém o QR Code para conexão da instância
   */
  async getQrCode(instanceName: string) {
    try {
      const response = await this.api.get(`/instance/qrcode/${instanceName}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter QR code da instância ${instanceName}:`, error);
      throw new Error(`Falha ao obter QR code: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Envia uma mensagem de texto para um número
   */
  async sendText(instanceName: string, phoneNumber: string, message: string) {
    try {
      const response = await this.api.post(`/message/sendText/${instanceName}`, {
        number: phoneNumber,
        options: {
          delay: 1200
        },
        textMessage: {
          text: message
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao enviar mensagem pela instância ${instanceName}:`, error);
      throw new Error(`Falha ao enviar mensagem: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 