#!/bin/bash

echo "==== Iniciando deploy do MCP Evolution WhatsApp API ===="

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "Arquivo .env não encontrado. Criando a partir do exemplo..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Arquivo .env criado. Por favor, edite-o com suas configurações corretas."
        echo "IMPORTANTE: Defina EVOLUTION_API_URL e EVOLUTION_API_KEY."
        exit 1
    else
        echo "ERRO: Arquivo .env.example não encontrado."
        echo "Por favor, crie um arquivo .env com as variáveis necessárias:"
        echo "EVOLUTION_API_URL=http://seu-servidor-evolution-api/"
        echo "EVOLUTION_API_KEY=sua-chave-api"
        exit 1
    fi
fi

# Verificar se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
    echo "ERRO: O Docker não está em execução ou não está instalado."
    echo "Por favor, inicie o serviço Docker ou instale o Docker."
    exit 1
fi

# Iniciar os containers
echo "Iniciando containers Docker..."

# Tentar iniciar o Docker Compose
if ! docker-compose up -d --build; then
    echo
    echo "Ocorreu um erro ao iniciar os containers."
    echo "Se o erro for relacionado à codificação do arquivo .env, tente:"
    echo "1. Execute ./fix-env.sh para corrigir a codificação"
    echo "2. Execute este script novamente"
    exit 1
fi

# Verificar se os containers estão em execução
echo "Verificando status dos containers..."
docker-compose ps

echo "==== Deploy concluído! ===="
echo "O servidor MCP está disponível em: http://localhost:3000"
echo "Para visualizar os logs: docker-compose logs -f" 