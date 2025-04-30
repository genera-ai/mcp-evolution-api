// Teste de carregamento do arquivo .env
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';

// Encontra o diretório raiz do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Busca em possíveis localizações do arquivo .env
const envPaths = [
  join(__dirname, '.env'),
  resolve(process.cwd(), '.env'),
  resolve('.env'),
];

// Verifica cada caminho possível
let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Arquivo .env encontrado em: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('Arquivo .env não encontrado!');
} else {
  // Imprime as variáveis de ambiente
  console.log('Variáveis de ambiente:');
  console.log(`EVOLUTION_API_URL: ${process.env.EVOLUTION_API_URL}`);
  console.log(`EVOLUTION_API_KEY: ${process.env.EVOLUTION_API_KEY ? '[PRESENTE]' : '[AUSENTE]'}`);
  console.log(`PORT: ${process.env.PORT}`);
} 