@echo off
echo ==== Corrigindo codificação do arquivo .env ====

echo Criando arquivo .env temporário em codificação UTF-8...
echo # Arquivo .env para MCP Evolution WhatsApp API > .env.tmp
echo EVOLUTION_API_URL=https://sua-evolution-api.com/ >> .env.tmp
echo EVOLUTION_API_KEY=sua-chave-aqui >> .env.tmp
echo PORT=3000 >> .env.tmp

echo Substituindo o arquivo .env original...
move /y .env.tmp .env

echo ==== Arquivo .env corrigido! ====
echo Agora você pode editar o arquivo .env com suas credenciais.
echo IMPORTANTE: Use um editor de texto como Notepad ou VS Code
echo e salve o arquivo em formato UTF-8 sem BOM. 