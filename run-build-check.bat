@echo off
echo Corriendo npm run build...
cd /d "%~dp0"
npm run build > build-output.txt 2>&1
echo.
echo === RESULTADO ===
if %ERRORLEVEL% == 0 (
  echo BUILD EXITOSO
) else (
  echo BUILD FALLIDO - revisa build-output.txt
  echo.
  echo Ultimas 50 lineas de errores:
  powershell -Command "Get-Content build-output.txt | Select-Object -Last 50"
)
pause
