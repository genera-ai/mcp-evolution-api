@echo off
echo ==== Testando o servidor MCP Evolution WhatsApp API ====

REM Testar conexão com o servidor
echo Verificando se o servidor esta online...
curl -s http://localhost:3000/mcp/tools > nul
if %errorlevel% neq 0 (
    echo ERRO: Nao foi possivel conectar ao servidor MCP.
    echo Verifique se o servidor esta em execucao com 'docker-compose ps'
    exit /b 1
)

echo Servidor esta online!

REM Obter lista de ferramentas
echo Obtendo lista de ferramentas disponiveis...
curl -s http://localhost:3000/mcp/tools

echo.
echo Para executar uma ferramenta, use um comando como:
echo curl -X POST http://localhost:3000/mcp/run -H "Content-Type: application/json" -d "{\"name\":\"listEvolutionInstances\"}"
echo.
echo ==== Teste concluido! ==== 