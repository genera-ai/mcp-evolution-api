import { createMcpServer } from './mcp/server.js';
import { config, validateConfig } from './config.js';

async function main() {
  try {
    // Validar configuração
    validateConfig();
    
    // Criar servidor MCP
    const server = createMcpServer();
    
    // Iniciar servidor
    await server.listen(config.server.port);
    console.log(`✅ Servidor MCP Evolution WhatsApp API iniciado na porta ${config.server.port}`);
    console.log(`💬 Conectado à Evolution API em: ${config.evolutionApi.url}`);
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar o servidor
main();

// Lidar com sinais para encerramento gracioso
process.on('SIGINT', () => {
  console.log('Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Encerrando servidor...');
  process.exit(0);
}); 