import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';

// Tenta carregar o .env de várias maneiras
try {
  // Encontra o diretório raiz do projeto
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = join(__dirname, '..');

  // Carrega o arquivo .env se existir
  const envPaths = [
    join(rootDir, '.env'),
    resolve(process.cwd(), '.env'),
    resolve('.env'),
  ];

  let envLoaded = false;

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Carregando arquivo .env de: ${envPath}`);
      dotenv.config({ path: envPath });
      envLoaded = true;
      break;
    }
  }

  if (!envLoaded) {
    console.warn('Arquivo .env não encontrado. Usando valores padrão ou variáveis de ambiente do sistema.');
    // Carregar dotenv mesmo sem arquivo, para processar variáveis de ambiente
    dotenv.config();
  }
} catch (error) {
  console.error('Erro ao carregar arquivo .env:', error);
  // Continuar sem carregar o .env - usaremos os valores padrão
}


// Configuração da aplicação
export const config = {
  evolutionApi: {
    url: process.env.EVOLUTION_API_URL,
    key: process.env.EVOLUTION_API_KEY,
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
};

// Validação das variáveis obrigatórias
export function validateConfig(): void {
  console.log('Configuração atual:');
  console.log(`EVOLUTION_API_URL: ${config.evolutionApi.url}`);
  console.log(`EVOLUTION_API_KEY: ${config.evolutionApi.key ? '[PRESENTE]' : '[AUSENTE]'}`);
  console.log(`PORT: ${config.server.port}`);

  if (!config.evolutionApi.url) {
    throw new Error('A variável de ambiente EVOLUTION_API_URL é obrigatória');
  }
  
  if (!config.evolutionApi.key) {
    throw new Error('A variável de ambiente EVOLUTION_API_KEY é obrigatória');
  }
} 