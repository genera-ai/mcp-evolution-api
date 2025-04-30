#!/bin/bash

echo "==== Corrigindo codificação do arquivo .env ===="

echo "Criando arquivo .env temporário em codificação UTF-8..."
cat > .env.tmp << 'EOF'
# Arquivo .env para MCP Evolution WhatsApp API
EVOLUTION_API_URL=https://sua-evolution-api.com/
EVOLUTION_API_KEY=sua-chave-aqui
PORT=3000
EOF

echo "Substituindo o arquivo .env original..."
mv .env.tmp .env

echo "==== Arquivo .env corrigido! ===="
echo "Agora você pode editar o arquivo .env com suas credenciais."
echo "IMPORTANTE: Use um editor de texto que salve arquivos em formato UTF-8." 