<h1 align="center">GoBarber</h1>

App agregador de eventos para desenvolvedores desenvolvido como projeto final do Bootcamp GoStack 7.0 
  
## Inicialização

Criar banco de dados postgres:
```
docker run --name gobarber -e POSTGRES_PASSWORD=suasenha -p 5432:5432 -d postgres
```
Iniciar banco postgres:
```
docker start gobarber
```
Migrar tabelas para postgres:
```
yarn typeorm migration:run
```
Instalar dependências:
```
yarn
```
Rodar projeto:
```
yarn dev:server
```
