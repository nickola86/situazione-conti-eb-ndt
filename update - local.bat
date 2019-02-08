rem set TIMBRATURE_HOST=https://timbrature.herokuapp.com
set TIMBRATURE_HOST=http://localhost:3000
curl -H "Content-Type: application/json" -X POST %TIMBRATURE_HOST%/api/event/nicola.di.trani/2019-01-24T13:31:06.399Z -d "{\"user\":\"nicola.di.tranx\",\"type\":\"unlock\",\"datetime\":\"2019-01-24T13:31:06.399Z\",\"elapsed\":306306}"
exit 0