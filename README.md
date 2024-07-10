# Aplicação Node.js com Sequelize e Autenticação JWT

Este projeto é uma aplicação Node.js que demonstra autenticação usando tokens JWT, ORM Sequelize para gerenciamento de banco de dados e fornece endpoints de API REST para gerenciar usuários, contratos e empresas.

## Como Começar

### Pré-requisitos

- Node.js instalado
- npm (Node Package Manager) instalado

### Instalação

1. Clone o repositório:

   git clone <url_do_repositorio>
   cd <diretorio_do_projeto>

2. Instale as dependências:
   npm i

3. Configure o banco de dados (se necessário):
   npm run setup-db

4. Inicie a aplicação:
   npm start

### O servidor será iniciado em http://localhost:3000.

# Documentação da API

##Autenticação

 POST /api/auth/login
  
   - Faz login de um usuário com nome de usuário e senha.
     
   - Retorna um token JWT para acessar rotas protegidas.
     
## Gerenciamento de Usuários

 GET /api/users
  
   - Recupera todos os usuários (apenas para admin).


 POST /api/users/create
 
   - Cria um novo usuário.

 GET /api/auth/me
 
   - Recupera detalhes do usuário logado.

## Contratos

 GET /api/contracts
   
   - Recupera contratos de uma empresa com base na data de início.

## Empresas

 GET /api/companies
 
   - Recupera todas as empresas registradas.

## Segurança

   - Autenticação JWT para login seguro de usuário.  
   - Validação e sanitização de dados para prevenir ataques de injeção.
   - Hashing de senhas para armazenamento seguro.

## Contribuições
   - Contribuições são bem-vindas! Faça um fork do repositório e envie um pull request.

