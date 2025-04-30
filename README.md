# MCP Evolution API

Servidor MCP (Model Context Protocol) para integração com a Evolution API do WhatsApp.

## 📋 Visão Geral

Este servidor MCP permite que o Claude interaja com o WhatsApp através da Evolution API, habilitando recursos como:
- Gerenciamento de instâncias do WhatsApp
- Envio de mensagens de texto
- Obtenção de QR Code para conexão
- Verificação de status de instâncias

## 🚀 Configuração Rápida

### Configuração de Ambiente

Crie um arquivo `.env` com suas credenciais da Evolution API:

```
EVOLUTION_API_URL=https://your-evolution-api-server.com
EVOLUTION_API_KEY=your-api-key-here
PORT=3000
```

### Requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Evolution API instalada e rodando (veja a [documentação oficial](https://github.com/evolution-api/evolution-api))

### 📋 Opções de Implantação

| Ambiente               | Passos                                           | Comando                                                                                     |
|------------------------|--------------------------------------------------|--------------------------------------------------------------------------------------------|
| **Desenvolvimento Local** | 1. Clone e instale<br>2. Execute em modo dev     | `git clone https://github.com/genera-ai/mcp-evolution-api.git && cd mcp-evolution-api && npm install && npm run dev` |
| **Produção Local**     | 1. Clone e instale<br>2. Construa e execute      | `git clone https://github.com/genera-ai/mcp-evolution-api.git && cd mcp-evolution-api && npm install && npm run build && npm start` |
| **Docker**             | Execute container Docker                          | `docker run -d -p 3000:3000 -e EVOLUTION_API_URL=seuurl -e EVOLUTION_API_KEY=suachave --name mcp-evolution-api generaai/mcp-evolution-api:latest` |

### Configuração do Claude Desktop

Adicione isto ao seu arquivo de configuração do Claude Desktop (geralmente localizado em `%APPDATA%/Claude/claude_desktop_config.json` no Windows):

```json
{
  "mcpServers": {
    "evo-api": {
      "url": "http://localhost:3000"
    }
  }
}
```

Ou, se estiver executando localmente:

```json
{
  "mcpServers": {
    "evo-api": {
      "command": "node",
      "args": [
        "C:/caminho/para/seu/mcp-evolution-api/dist/main.js"
      ]
    }
  }
}
```

## 🔧 Ferramentas Disponíveis

O servidor MCP expõe as seguintes ferramentas para o Claude:

- **createEvolutionInstance**: Cria uma nova instância do WhatsApp
- **listEvolutionInstances**: Lista todas as instâncias disponíveis
- **getWhatsAppQrCode**: Obtém o QR code para conexão de uma instância
- **sendWhatsAppMessage**: Envia uma mensagem de texto para um contato

## 🧪 Exemplos de Uso

### Criar uma nova instância
```
Crie uma nova instância do WhatsApp com o nome "minha_instancia"
```

### Enviar uma mensagem
```
Envie a mensagem "Olá, como vai?" para o número 551199999999 usando a instância "minha_instancia"
```

## 📚 Documentação

Para mais detalhes sobre a API Evolution, consulte a [documentação oficial](https://docs.evolution-api.com/).

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Créditos

Desenvolvido por [Generaai](https://www.generaai.com.br)  
Autor: Rubens U M Mendonça  
Email: suporte@generaai.com.br  
Projeto desenvolvido com assistência de [Cursor AI](https://cursor.com)

## Deploy com Docker

### 1. Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
EVOLUTION_API_URL=http://seu-servidor-evolution-api/
EVOLUTION_API_KEY=sua-chave-api
PORT=3000
```

### 2. Build e Execução

Para iniciar o servidor em modo de produção:

```bash
docker-compose up -d
```

Este comando irá:
- Construir a imagem Docker
- Iniciar o container em modo detached (background)
- Mapear a porta 3000 para acesso ao servidor MCP

### 3. Verificar Logs

Para acompanhar os logs da aplicação:

```bash
docker-compose logs -f
```

### 4. Parar o Servidor

Para parar o servidor:

```bash
docker-compose down
```

## Integração com a Evolution API no Docker

O arquivo `docker-compose.yml` inclui uma configuração comentada para executar a Evolution API junto com o servidor MCP. Para habilitar essa integração:

1. Edite o arquivo `docker-compose.yml` e descomente as seções relacionadas à Evolution API
2. Ajuste as variáveis de ambiente conforme necessário
3. Execute o comando `docker-compose up -d`

Isso irá iniciar tanto o servidor MCP quanto a Evolution API em containers separados, mas na mesma rede Docker, permitindo que se comuniquem entre si.

Para esse cenário, configure a variável `EVOLUTION_API_URL` como `http://evolution-api:8080/` no arquivo `.env`.

## Uso do Servidor MCP

O servidor estará disponível em `http://localhost:3000` com os seguintes endpoints:

- `/mcp/tools` - Lista todas as ferramentas disponíveis
- `/mcp/run` - Executa uma ferramenta específica

## Manutenção

### Atualização

Para atualizar a aplicação com novas mudanças:

```bash
git pull
docker-compose up -d --build
```

### Backup

Os dados persistentes são armazenados no volume `mcp-data`. Para fazer backup:

```bash
docker volume inspect mcp-data # Identifica o local do volume
# Use ferramentas de backup para salvar esse diretório
```
