# MCP Evolution API

Servidor MCP (Model Context Protocol) para integração com a Evolution API do WhatsApp.

## 📋 Visão Geral

Este servidor MCP permite que modelos de linguagem interajam com o WhatsApp através da Evolution API, habilitando recursos como:
- Gerenciamento de instâncias do WhatsApp
- Envio de mensagens de texto
- Obtenção de QR Code para conexão
- Verificação de status de instâncias

## 🚀 Configuração Rápida

### Requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Acesso a uma instalação da Evolution API (URL e chave de API)

### Configuração de Ambiente

Crie um arquivo `.env` com suas credenciais da Evolution API:

```env
# Evolution API
EVOLUTION_API_URL=https://sua-evolution-api.com/
EVOLUTION_API_KEY=sua_chave_da_evolution_api
PORT=3000

# Autenticação
API_KEY=sua_chave_api_para_acesso
```

### 📋 Opções de Implantação

| Ambiente               | Passos                                           | Comando                                                                                     |
|------------------------|--------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Desenvolvimento Local** | 1. Clone e instale<br>2. Execute em modo dev     | `git clone https://github.com/genera-ai/mcp-evolution-api.git && cd mcp-evolution-api && npm install && npm run dev` |
| **Produção Local**     | 1. Clone e instale<br>2. Construa e execute      | `git clone https://github.com/genera-ai/mcp-evolution-api.git && cd mcp-evolution-api && npm install && npm run build && npm start` |
| **Docker**             | Execute container Docker                          | `docker run -d -p 3000:3000 -e EVOLUTION_API_URL=seuurl -e EVOLUTION_API_KEY=suachave -e API_KEY=suaapikey --name mcp-evolution-api generaai/mcp-evolution-api:latest` |

## 🔒 Autenticação

O sistema utiliza autenticação por API Key para proteger os endpoints. Para autenticar suas requisições, adicione um cabeçalho `X-API-Key` com a chave definida na variável de ambiente `API_KEY`:

```bash
curl -X GET http://localhost:3000/tools \
  -H "X-API-Key: sua_chave_api"
```

Todas as rotas da API (exceto `/initialize`) são protegidas e requerem autenticação via cabeçalho `X-API-Key`.

## 🔧 Ferramentas Disponíveis

O servidor MCP expõe as seguintes ferramentas:

- **createEvolutionInstance**: Cria uma nova instância do WhatsApp
- **listEvolutionInstances**: Lista todas as instâncias disponíveis
- **getWhatsAppQrCode**: Obtém o QR code para conexão de uma instância
- **sendWhatsAppMessage**: Envia uma mensagem de texto para um contato

## 🧪 Exemplos de Uso

### Listar Ferramentas Disponíveis

```bash
curl -X GET http://localhost:3000/tools \
  -H "X-API-Key: sua_chave_api"
```

### Executar uma Ferramenta (Listar Instâncias)

```bash
curl -X POST http://localhost:3000/tools/listEvolutionInstances \
  -H "X-API-Key: sua_chave_api" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🐳 Deploy com Docker

### 1. Usando variáveis de ambiente

```bash
docker run -d -p 3000:3000 \
  -e EVOLUTION_API_URL=https://sua-evolution-api.com/ \
  -e EVOLUTION_API_KEY=sua_chave_da_evolution_api \
  -e API_KEY=sua_chave_api \
  --name mcp-evolution-api generaai/mcp-evolution-api:latest
```

### 2. Usando arquivo .env com --env-file

Crie um arquivo `.env.docker` e execute:

```bash
docker run -d -p 3000:3000 \
  --env-file .env.docker \
  --name mcp-evolution-api generaai/mcp-evolution-api:latest
```

### 3. Usando Docker Compose

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3'

services:
  mcp-evolution-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - EVOLUTION_API_URL=https://sua-evolution-api.com/
      - EVOLUTION_API_KEY=sua_chave_da_evolution_api
      - PORT=3000
      - API_KEY=sua_chave_api
```

E execute:
```bash
docker-compose up -d
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Créditos

Desenvolvido por [Generaai](https://www.generaai.com.br)  
Autor: Rubens U M Mendonça  
Email: suporte@generaai.com.br
