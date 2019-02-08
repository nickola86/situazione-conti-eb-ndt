rem set TIMBRATURE_HOST=https://timbrature.herokuapp.com
set TIMBRATURE_HOST=http://localhost:3000
curl -H "Content-Type: application/json" -X POST %TIMBRATURE_HOST%/api/event/new -d "{\"user\":\"%username%\",\"type\":\"lock\",\"datetime\":null}"
exit 0