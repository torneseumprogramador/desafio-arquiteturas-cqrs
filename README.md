# Aplicação Node.js com CQRS

Esta é uma aplicação Node.js com TypeScript que implementa o padrão arquitetural CQRS (Command Query Responsibility Segregation).

## 🏗️ Arquitetura

A aplicação segue uma arquitetura em camadas bem definidas:

- **Domain**: Entidades, interfaces de repositórios e regras de negócio
- **Application**: Comandos, queries e handlers (CQRS)
- **Infrastructure**: Implementações de repositórios e configurações de banco
- **Presentation**: Controllers e rotas HTTP

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express** como framework HTTP
- **Drizzle ORM** para acesso ao banco de dados
- **PostgreSQL** como banco de dados
- **UUID** para identificação de entidades

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd desafio-arquiteturas-cqrs
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/cqrs_db
PORT=3000
NODE_ENV=development
```

4. Configure o banco de dados:
```bash
# Gerar migrações
npm run generate

# Executar migrações
npm run migrate
```

## 🏃‍♂️ Executando a aplicação

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Endpoints da API

### Usuários

- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário por ID
- `GET /api/users` - Listar todos os usuários

### Produtos

- `POST /api/products` - Criar produto
- `GET /api/products/:id` - Buscar produto por ID
- `GET /api/products` - Listar todos os produtos

### Health Check

- `GET /health` - Verificar status da aplicação

## 📝 Exemplos de Uso

### Criar um usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar um produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell",
    "description": "Notebook Dell Inspiron 15 polegadas",
    "price": 3500.00,
    "stock": 10
  }'
```

### Buscar todos os usuários
```bash
curl http://localhost:3000/api/users
```

### Buscar produto por ID
```bash
curl http://localhost:3000/api/products/{product-id}
```

## 🏗️ Estrutura do Projeto

```
src/
├── application/
│   ├── commands/
│   │   ├── users/
│   │   └── products/
│   ├── queries/
│   │   ├── users/
│   │   └── products/
│   └── interfaces/
├── domain/
│   ├── users/
│   ├── products/
│   └── orders/
├── infrastructure/
│   └── database/
├── presentation/
│   ├── controllers/
│   └── routes/
├── shared/
│   ├── utils/
│   └── exceptions/
└── main.ts
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar em produção
- `npm run generate` - Gerar migrações do Drizzle
- `npm run migrate` - Executar migrações
- `npm run studio` - Abrir Drizzle Studio

## 🧪 Próximos Passos

- Implementar autenticação e autorização
- Adicionar validação de entrada com Joi ou Zod
- Implementar testes unitários e de integração
- Adicionar logging estruturado
- Implementar cache com Redis
- Adicionar documentação da API com Swagger
- Implementar eventos de domínio
- Adicionar monitoramento e métricas

## 📄 Licença

MIT 