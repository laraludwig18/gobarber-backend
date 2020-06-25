# GoBarber

Backend do app para agendamento de serviços de barbearia

## Estrutura do projeto

* [src]
  - [@types] Pasta contendo as definições de tipo
  - [config] Pasta contendo as configurações gerais do projeto
  - [modules] Pasta contendo os domínios do projeto
    - [users] Pasta contendo as informações relacionadas ao domínio de usuário
      - [dtos] Pasta contendo os objetos usados na transferência de dados
      - [infra] Pasta contendo as implementações da camada de infra
        - [http] Pasta contendo as implementações que se referem a camada http
          - [controllers] Pasta contendo os arquivos de controle
          - [middlewares] Pasta contendo os middlewares
          - [routes] Pasta contendo as rotas
        - [typeorm] Pasta contendo as implementações ligadas ao typeorm
          - [entities] Pasta contendo as entidades do typeorm
          - [repositories] Pasta contendo os arquivos de implementação dos métodos para acesso ao banco
      - [providers] Pasta contendo os provedores de serviço que são dependências externas do domínio de usuário
        - [HashProvider] Pasta contendo os provedores do serviço de hash de senha
          - [fakes] Pasta contendo o mock da implementação independente do provedor
          - [implementations] Pasta contendo as implementações dos provedores
          - [models] Pasta contendo a interface em comum entre os provedores
        - index.ts Arquivo que faz a injeção das dependências dos provedores
      - [repositories] Pasta contendo as interfaces dos métodos para acesso ao banco
        - [fakes] Pasta contendo o mock da implementação do repositório
      - [services] Pasta contendo as regras de negócio relacionadas ao domínio de usuário
        - [__tests__] Pasta contendo os testes unitários dos arquivos de serviço
  - [shared] Pasta contendo os arquivos que serão compartilhados entre os domínios do projeto
    - [container] Pasta contendo a implementação de injeção de dependências
      - [providers]
        - [StorageProvider]
          - [fakes]
          - [implementations]
          - [models]
        - index.ts Arquivo que faz a injeção das dependências dos provedores
      - index.ts Arquivo que faz a injeção das dependências de todo o projeto
    - [errors] Pasta contendo os arquivos de erro
    - [infra]
      - [http]
        - [routes] Pasta contendo as configurações de todas as rotas do projeto
        - server.ts Arquivo base onde estão as configuraçes gerais do projeto
      - [typeorm]
        - [migrations] Pasta contendo os arquivos de versionamento do typeorm
        - index.ts Arquivo de conexão do typeorm

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


