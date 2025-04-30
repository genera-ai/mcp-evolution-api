@echo off
echo ==== Iniciando deploy do MCP Evolution WhatsApp API ====

REM Verificar se .env existe
if not exist .env (
    echo Arquivo .env nao encontrado. Tentando criar a partir do exemplo...
    if exist .env.example (
        copy .env.example .env
        echo Arquivo .env criado. Por favor, edite-o com suas configuracoes corretas.
        echo IMPORTANTE: Defina EVOLUTION_API_URL e EVOLUTION_API_KEY.
        exit /b 1
    ) else (
        echo ERRO: Arquivo .env.example nao encontrado.
        echo Por favor, crie um arquivo .env com as variaveis necessarias:
        echo EVOLUTION_API_URL=http://seu-servidor-evolution-api/
        echo EVOLUTION_API_KEY=sua-chave-api
        exit /b 1
    )
)

REM Verificar se o Docker está em execução
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: O Docker nao esta em execucao ou nao esta instalado.
    echo Por favor, inicie o Docker Desktop ou instale o Docker.
    exit /b 1
)

REM Iniciar os containers
echo Iniciando containers Docker...

REM Tentar iniciar o Docker Compose
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo.
    echo Ocorreu um erro ao iniciar os containers.
    echo Se o erro for relacionado a codificacao do arquivo .env, tente:
    echo 1. Execute fix-env.bat para corrigir a codificacao
    echo 2. Execute este script novamente
    exit /b 1
)

REM Verificar se os containers estão em execução
echo Verificando status dos containers...
docker-compose ps

echo ==== Deploy concluido! ====
echo O servidor MCP esta disponivel em: http://localhost:3000
echo Para visualizar os logs: docker-compose logs -f 