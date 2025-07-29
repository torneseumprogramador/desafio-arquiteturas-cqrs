# 🛒 Ecommerce CQRS Architecture - Desafio de Arquiteturas de Software

## 📚 Sobre o Projeto

Este projeto foi desenvolvido como parte do **Desafio de Arquiteturas de Software** do curso [Arquiteturas de Software Modernas](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software) ministrado pelo **Prof. Danilo Aparecido** na plataforma [Torne-se um Programador](https://www.torneseumprogramador.com.br/).

### 🎯 Objetivo

Implementar um sistema de e-commerce utilizando **Arquitetura CQRS (Command Query Responsibility Segregation)** com Node.js, TypeScript e Express, demonstrando boas práticas de desenvolvimento e organização de código.

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura CQRS** com uma separação clara entre comandos (write) e queries (read):

```
┌─────────────────────────────────────┐
│        Presentation Layer           │ ← Controllers, Routes, DTOs
├─────────────────────────────────────┤
│        Application Layer            │ ← Commands, Queries, Handlers
├─────────────────────────────────────┤
│           Domain Layer              │ ← Entities, Business Rules
├─────────────────────────────────────┤
│      Infrastructure Layer           │ ← Repositories, Database
└─────────────────────────────────────┘
```

### 📁 Estrutura do Projeto

```
src/
├── application/                      # Camada de aplicação (CQRS)
│   ├── commands/                     # Comandos para modificação de dados
│   │   ├── users/
│   │   │   ├── create-user.command.ts
│   │   │   └── create-user.handler.ts
│   │   └── products/
│   │       ├── create-product.command.ts
│   │       └── create-product.handler.ts
│   ├── queries/                      # Queries para leitura de dados
│   │   ├── users/
│   │   │   ├── get-user.query.ts
│   │   │   ├── get-user.handler.ts
│   │   │   ├── get-all-users.query.ts
│   │   │   └── get-all-users.handler.ts
│   │   └── products/
│   │       ├── get-product.query.ts
│   │       ├── get-product.handler.ts
│   │       ├── get-all-products.query.ts
│   │       └── get-all-products.handler.ts
│   └── interfaces/                   # Interfaces dos handlers
│       ├── command-handler.interface.ts
│       └── query-handler.interface.ts
├── domain/                           # Camada de domínio
│   ├── users/
│   │   ├── user.entity.ts            # Entidade de usuário
│   │   └── user.repository.ts        # Interface do repositório
│   ├── products/
│   │   ├── product.entity.ts         # Entidade de produto
│   │   └── product.repository.ts     # Interface do repositório
│   └── orders/
│       ├── order.entity.ts           # Entidade de pedido
│       ├── order-product.entity.ts   # Entidade de produto do pedido
│       └── order.repository.ts       # Interface do repositório
├── infrastructure/                   # Camada de infraestrutura
│   ├── database/
│   │   ├── connection.ts             # Conexão com banco de dados
│   │   ├── models/                   # Modelos do Drizzle ORM
│   │   │   ├── user.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── order-product.model.ts
│   │   └── repositories/             # Implementações dos repositórios
│   │       ├── user.repository.ts
│   │       └── product.repository.ts
│   └── config/
│       └── database.config.ts        # Configurações do banco
├── presentation/                     # Camada de apresentação
│   ├── controllers/                  # Controllers HTTP
│   │   ├── user.controller.ts
│   │   └── product.controller.ts
│   └── routes/                       # Definição de rotas
│       ├── user.routes.ts
│       └── product.routes.ts
├── shared/                           # Utilitários compartilhados
│   ├── utils/
│   │   └── validation.util.ts        # Utilitários de validação
│   └── exceptions/                   # Exceções customizadas
│       ├── domain.exception.ts
│       ├── user-not-found.exception.ts
│       └── product-not-found.exception.ts
└── main.ts                          # Ponto de entrada da aplicação
```

## 🚀 Tecnologias Utilizadas

- **Node.js 18+** - Runtime JavaScript
- **TypeScript 5.3+** - Linguagem de programação tipada
- **Express 4.18+** - Framework web
- **Drizzle ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **UUID** - Identificação única de entidades
- **Helmet** - Middleware de segurança
- **CORS** - Cross-Origin Resource Sharing
- **Swagger UI** - Documentação interativa da API
- **Arquitetura CQRS** - Padrão arquitetural

## 📋 Pré-requisitos

- [Node.js 18+](https://nodejs.org/) ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL 12+](https://www.postgresql.org/) ou [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## ⚡ Como Executar

### Método Rápido (Recomendado)

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd desafio-arquiteturas-cqrs

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações (se necessário)
npm run generate
npm run migrate

# Inicie a aplicação
npm run dev
```

### Método com Docker

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd desafio-arquiteturas-cqrs

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env

# Inicie o PostgreSQL com Docker
docker run --name postgres-cqrs \
  -e POSTGRES_DB=cqrs_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15

# Execute as migrações
npm run generate
npm run migrate

# Inicie a aplicação
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila o TypeScript
npm run start        # Executa em produção
npm run generate     # Gera migrações do Drizzle
npm run migrate      # Executa migrações
npm run studio       # Abre o Drizzle Studio
```

### Scripts do run.sh

```bash
./run.sh             # Execução completa (Docker + Build + Start)
./run.sh build       # Apenas build do projeto
./run.sh dev         # Modo desenvolvimento
./run.sh migrate     # Executa migrações
./run.sh studio      # Abre Drizzle Studio
./run.sh check-db    # Verifica dados no banco
./run.sh test-health # Testa endpoints de health
./run.sh test-swagger # Testa Swagger UI
./run.sh help        # Mostra ajuda completa
```

## 🌐 Acessando a API

Após executar o projeto, a API estará disponível em:

- **API Base**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Swagger UI**: http://localhost:3000/api-docs
- **Drizzle Studio**: https://local.drizzle.studio

### 📚 Documentação da API

A documentação completa da API está disponível através do **Swagger UI**:

🌐 **Swagger UI**: http://localhost:3000/api-docs

O Swagger UI oferece:
- ✅ Documentação interativa de todos os endpoints
- ✅ Exemplos de requisições e respostas
- ✅ Teste direto dos endpoints
- ✅ Esquemas de dados detalhados
- ✅ Códigos de status HTTP

## 🔧 Configuração do Banco de Dados

O projeto utiliza **PostgreSQL** com as seguintes configurações padrão:

- **Host**: localhost
- **Porta**: 5432
- **Database**: cqrs_db
- **Usuário**: postgres
- **Senha**: postgres

### Connection String

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cqrs_db
```

### Configuração via Docker

```bash
# Criar rede Docker
docker network create cqrs-network

# Executar PostgreSQL
docker run --name postgres-cqrs \
  --network cqrs-network \
  -e POSTGRES_DB=cqrs_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

## 📖 Endpoints da API

> 📚 **Documentação Completa**: Acesse [Swagger UI](http://localhost:3000/api-docs) para documentação interativa completa.

### 👥 Usuários (User)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/users` | Criar usuário |
| GET | `/api/users` | Listar todos os usuários |
| GET | `/api/users/:id` | Buscar usuário por ID |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |

**Exemplo de criação de usuário:**
```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 📦 Produtos (Product)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/products` | Criar produto |
| GET | `/api/products` | Listar todos os produtos |
| GET | `/api/products/:id` | Buscar produto por ID |
| PUT | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Deletar produto |

**Exemplo de criação de produto:**
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone XYZ",
    "description": "Smartphone de última geração",
    "price": 1299.99,
    "stock": 50
  }'
```

**Resposta esperada:**
```json
{
  "message": "Produto criado com sucesso",
  "product": {
    "id": "uuid-do-produto",
    "name": "Smartphone XYZ",
    "description": "Smartphone de última geração",
    "price": 1299.99,
    "stock": 50,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 🛒 Pedidos (Order)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/orders` | Criar pedido |
| GET | `/api/orders` | Listar todos os pedidos |
| GET | `/api/orders/:id` | Buscar pedido por ID |

### 🏥 Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status geral da aplicação |
| GET | `/health/ping` | Teste simples de conectividade |
| GET | `/health/database` | Status detalhado do banco de dados |
| GET | `/health/detailed` | Health check detalhado com todos os componentes |

**Exemplo:**
```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "Aplicação CQRS funcionando corretamente",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🏛️ Conceitos de Arquitetura CQRS Implementados

### 📦 Entidades de Domínio

- **User** (Usuário) - Entidade de usuário do sistema
- **Product** (Produto) - Entidade de produto com controle de estoque
- **Order** (Pedido) - Entidade de pedido com múltiplos produtos
- **OrderProduct** (Produto do Pedido) - Entidade de relacionamento

### 🔄 Comandos (Commands)

- **CreateUserCommand** - Criar usuário
- **CreateProductCommand** - Criar produto

### 🔍 Queries

- **GetUserQuery** - Buscar usuário por ID
- **GetAllUsersQuery** - Listar todos os usuários
- **GetProductQuery** - Buscar produto por ID
- **GetAllProductsQuery** - Listar todos os produtos

### 🎯 Handlers

- **CreateUserHandler** - Processa criação de usuário
- **GetUserHandler** - Processa busca de usuário
- **GetAllUsersHandler** - Processa listagem de usuários
- **CreateProductHandler** - Processa criação de produto
- **GetProductHandler** - Processa busca de produto
- **GetAllProductsHandler** - Processa listagem de produtos

## 🧪 Exemplos de Uso

### Fluxo Completo de Criação

```bash
# 1. Criar usuário
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'

# 2. Criar produto
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone XYZ",
    "description": "Smartphone de última geração",
    "price": 1299.99,
    "stock": 50
  }'

# 3. Listar todos os usuários
curl http://localhost:3000/api/users

# 4. Listar todos os produtos
curl http://localhost:3000/api/products

# 5. Buscar usuário específico
curl http://localhost:3000/api/users/{user-id}

# 6. Buscar produto específico
curl http://localhost:3000/api/products/{product-id}
```

### Exemplos com JavaScript/Node.js

```javascript
// Criar usuário
const createUser = async () => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Buscar todos os produtos
const getAllProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  const data = await response.json();
  console.log(data);
};
```

## 🛡️ Funcionalidades Implementadas

- ✅ **Criação de usuários** com validação de email único
- ✅ **Busca de usuários** por ID e listagem completa
- ✅ **Criação de produtos** com controle de estoque
- ✅ **Busca de produtos** por ID e listagem completa
- ✅ **Validações de negócio** nas entidades do domínio
- ✅ **Arquitetura CQRS** com separação clara entre comandos e queries
- ✅ **TypeScript** com tipagem rigorosa
- ✅ **Drizzle ORM** para acesso ao banco de dados
- ✅ **PostgreSQL** como banco de dados
- ✅ **Express** com middlewares de segurança
- ✅ **Health check** para monitoramento
- ✅ **Estrutura modular** e escalável

## 🎓 Aprendizados do Curso

Este projeto demonstra os seguintes conceitos aprendidos no curso:

1. **Arquitetura CQRS (Command Query Responsibility Segregation)**
   - Separação entre comandos (write) e queries (read)
   - Handlers especializados para cada operação
   - Inversão de dependência

2. **Domain-Driven Design (DDD)**
   - Entidades de domínio com regras de negócio
   - Repositórios como interfaces
   - Separação clara de responsabilidades

3. **Padrões de Projeto**
   - Repository Pattern
   - Command Pattern
   - Query Pattern
   - Handler Pattern

4. **Boas Práticas**
   - SOLID Principles
   - Clean Architecture
   - Dependency Injection
   - TypeScript com tipagem rigorosa

## 🛡️ Regras de Negócio

### Usuário
- Nome não pode ser vazio
- Email deve ser válido e único
- Senha deve ter pelo menos 6 caracteres

### Produto
- Nome e descrição não podem ser vazios
- Preço deve ser maior que zero
- Quantidade em estoque não pode ser negativa

## Estrutura do Banco de Dados

O Drizzle ORM irá criar automaticamente as seguintes tabelas:
- `users` - Usuários do sistema
- `products` - Produtos disponíveis
- `orders` - Pedidos realizados
- `order_products` - Itens de cada pedido

## Testando a API

Você pode usar o curl ou qualquer cliente HTTP como Postman:

1. **Criar um usuário:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","password":"123456"}'
```

2. **Criar um produto:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone","description":"Smartphone novo","price":1299.99,"stock":10}'
```

3. **Listar todos os usuários:**
```bash
curl http://localhost:3000/api/users
```

4. **Listar todos os produtos:**
```bash
curl http://localhost:3000/api/products
```

### Acessando o Drizzle Studio

```bash
# Execute o comando para abrir o Drizzle Studio
npm run studio
```

## 👨‍🏫 Sobre o Professor

**Prof. Danilo Aparecido** é instrutor na plataforma [Torne-se um Programador](https://www.torneseumprogramador.com.br/), especializado em arquiteturas de software e desenvolvimento de sistemas escaláveis.

## 📚 Curso Completo

Para aprender mais sobre arquiteturas de software e aprofundar seus conhecimentos, acesse o curso completo:

**[Arquiteturas de Software Modernas](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)**

## 🤝 Contribuição

Este projeto foi desenvolvido como parte de um desafio educacional. Contribuições são bem-vindas através de issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para o curso de Arquiteturas de Software do [Torne-se um Programador](https://www.torneseumprogramador.com.br/)** 