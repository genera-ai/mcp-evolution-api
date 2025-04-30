#!/bin/bash

echo "==== Testando o servidor MCP Evolution WhatsApp API ===="

# Testar conexão com o servidor
echo "Verificando se o servidor está online..."
curl -s http://localhost:3000/mcp/tools > /dev/null
if [ $? -ne 0 ]; then
    echo "ERRO: Não foi possível conectar ao servidor MCP."
    echo "Verifique se o servidor está em execução com 'docker-compose ps'"
    exit 1
fi

echo "Servidor está online!"

# Obter lista de ferramentas
echo "Obtendo lista de ferramentas disponíveis..."
curl -s http://localhost:3000/mcp/tools | jq .

echo
echo "Para executar uma ferramenta, use um comando como:"
echo 'curl -X POST http://localhost:3000/mcp/run -H "Content-Type: application/json" -d \'{"name":"listEvolutionInstances"}\''
echo
echo "==== Teste concluído! ====" 