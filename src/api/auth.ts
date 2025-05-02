import { config } from '../config.js';

/**
 * Verifica se a API key fornecida é válida
 */
export function validateApiKey(apiKey: string): boolean {
  return config.auth.apiKey === apiKey;
} 