# GoBarber

Backend do app para agendamento de serviços de barbearia

![CI](https://github.com/laraludwig18/gobarber-api/workflows/CI/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/laraludwig18/gobarber-api/badge.svg?branch=ci-test)](https://coveralls.io/github/laraludwig18/gobarber-api?branch=ci-test)

## Estrutura do projeto

```
src/
├── @types
│   └── express.d.ts
├── config
│   └── auth.ts
├── modules
|   ├── users
|   |   ├── dtos
|   |   |   └── ICreateUserDTO.ts
|   |   ├── infra
|   |   |   ├── http
|   |   |   |   ├── controllers
|   |   |   |   |   └── UsersController.ts
|   |   |   |   ├── middlewares
|   |   |   |   |   └── ensureAuthenticated.ts
|   |   |   |   ├── routes
|   |   |   |   |   └── users.routes.ts
|   |   |   ├── typeorm
|   |   |   |   ├── entities
|   |   |   |   |   └── User.ts
|   |   |   |   ├── repositories
|   |   |   |   |   └── UsersRepository.ts
|   |   |   ├── providers
|   |   |   |   ├── HashProvider
|   |   |   |   |   ├── fakes
|   |   |   |   |   |   └── FakeHashProvider.ts
|   |   |   |   |   ├── implementations
|   |   |   |   |   |   └── BCryptHashProvider.ts
|   |   |   |   |   ├── models
|   |   |   |   |   |   └── IHashProvider.ts
|   |   |   |   ├── index.ts
|   |   |   ├── repositories
|   |   |   |   ├── fakes
|   |   |   |   |   └── FakeUsersRepository.ts
|   |   |   |   ├── IUsersRepository.ts
|   |   |   ├── services
|   |   |   |   ├── __tests__
|   |   |   |   |   └── CreateUserService.spec.ts
|   |   |   |   ├── CreateUserService.ts
|   |   |   ├── views
|   |   |   |   ├── forgot_password.hbs
├── shared
│   ├── container
|   |   ├── providers
|   |   |   ├── CacheProvider
|   |   |   |   ├── fakes
|   |   |   |   |   └── FakeCacheProvider.ts
|   |   |   |   ├── implementations
|   |   |   |   |   └── RedisCacheProvider.ts
|   |   |   |   ├── models
|   |   |   |   |   └── ICacheProvider.ts
|   |   |   |   ├── index.ts
|   |   |   ├── index.ts
|   |   ├── index.ts
|   ├── errors
│   |   └── AppError.ts
|   ├── infra
|   |   ├── http
|   |   |   ├── middlewares
|   |   |   |   └── rateLimiter.ts
|   |   |   ├── routes
|   |   |   |   └── index.ts
|   |   |   ├── server.ts
|   ├── typeorm
|   |   ├── migrations
|   |   |   └── 1587164388379-CreateUsers.ts
|   |   ├── index.ts
```

## Inicialização

Criar banco postgres:
```
docker run --name postgres-gobarber -e POSTGRES_PASSWORD=suasenha -p 5432:5432 -d postgres
```
Criar banco mongo:
```
docker run --name mongo-gobarber -p 27017:27017 -d -t mongo
```
Criar banco redis:
```
docker run --name redis-gobarber -p 6379:6379 -d -t redis:alpine
```
Migrar tabelas para o postgres:
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

## TODO

- [x] Remover retorno da senha ao buscar um usuário
- [x] Invalidar cache ao alterar perfil e avatar
- [x] Adicionar docker compose para subir ambiente local
- [x] Rever arquivos do coverage report
- [ ] Validar tamanho e tipo da imagem do avatar
- [ ] Isolar lib jsonwebtoken do serviço de autenticação de usuário
- [ ] Refatorar arquivo que chama providers
- [ ] Separar assets dos testes
- [ ] Melhorar tratamento dos horários disponíveis para agendamento em um dia
- [ ] Melhorar mensagens do Joi
- [ ] Documentação com swagger


