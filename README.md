# Aplicação Node.js com Sequelize e Autenticação JWT

Este projeto é uma aplicação Node.js que demonstra autenticação usando tokens JWT, ORM Sequelize para gerenciamento de banco de dados e fornece endpoints de API REST para gerenciar usuários, contratos e empresas.

## Como Começar

### Pré-requisitos

- Node.js instalado
- npm (Node Package Manager) instalado

### Instalação

Documentação da API
## Autenticação
##POST /api/auth/login
Faz login de um usuário com nome de usuário e senha.
Retorna um token JWT para acessar rotas protegidas.
Gerenciamento de Usuários
GET /api/users
Recupera todos os usuários (apenas para admin).
POST /api/users/create
Cria um novo usuário.
GET /api/auth/me
Recupera detalhes do usuário logado.
Contratos
GET /api/contracts/
/
Recupera contratos de uma empresa com base na data de início.
Empresas
GET /api/companies
Recupera todas as empresas registradas.
Segurança
Autenticação JWT para login seguro de usuário.
Validação e sanitização de dados para prevenir ataques de injeção.
Hashing de senhas para armazenamento seguro.
