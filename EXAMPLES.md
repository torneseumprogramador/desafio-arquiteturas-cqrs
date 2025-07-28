# Exemplos de Uso da API CQRS

Este arquivo contém exemplos práticos de como usar a API da aplicação CQRS.

## 🚀 Pré-requisitos

1. Certifique-se de que o PostgreSQL está rodando
2. Configure o arquivo `.env` com suas credenciais do banco
3. Execute as migrações: `npm run migrate`
4. Inicie o servidor: `npm run dev`

## 📝 Exemplos de Requisições

### 1. Criar um Usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Buscar Usuário por ID

```bash
curl http://localhost:3000/api/users/{user-id}
```

**Resposta esperada:**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Listar Todos os Usuários

```bash
curl http://localhost:3000/api/users
```

**Resposta esperada:**
```json
{
  "users": [
    {
      "id": "uuid-do-usuario-1",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-do-usuario-2",
      "name": "Maria Santos",
      "email": "maria@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Criar um Produto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell Inspiron",
    "description": "Notebook Dell Inspiron 15 polegadas, 8GB RAM, 256GB SSD",
    "price": 3500.00,
    "stock": 10
  }'
```

**Resposta esperada:**
```json
{
  "message": "Produto criado com sucesso",
  "product": {
    "id": "uuid-do-produto",
    "name": "Notebook Dell Inspiron",
    "description": "Notebook Dell Inspiron 15 polegadas, 8GB RAM, 256GB SSD",
    "price": 3500.00,
    "stock": 10,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Buscar Produto por ID

```bash
curl http://localhost:3000/api/products/{product-id}
```

**Resposta esperada:**
```json
{
  "product": {
    "id": "uuid-do-produto",
    "name": "Notebook Dell Inspiron",
    "description": "Notebook Dell Inspiron 15 polegadas, 8GB RAM, 256GB SSD",
    "price": 3500.00,
    "stock": 10,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Listar Todos os Produtos

```bash
curl http://localhost:3000/api/products
```

**Resposta esperada:**
```json
{
  "products": [
    {
      "id": "uuid-do-produto-1",
      "name": "Notebook Dell Inspiron",
      "description": "Notebook Dell Inspiron 15 polegadas, 8GB RAM, 256GB SSD",
      "price": 3500.00,
      "stock": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-do-produto-2",
      "name": "Mouse Wireless",
      "description": "Mouse wireless com 6 botões",
      "price": 89.90,
      "stock": 50,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7. Health Check

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

## 🔧 Exemplos com JavaScript/Node.js

### Usando fetch (Node.js 18+)

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
      email: 'joao@example.com',
      password: 'senha123'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Buscar usuário
const getUser = async (userId) => {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`);
  const data = await response.json();
  console.log(data);
};

// Criar produto
const createProduct = async () => {
  const response = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Notebook Dell Inspiron',
      description: 'Notebook Dell Inspiron 15 polegadas',
      price: 3500.00,
      stock: 10
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Usando axios

```javascript
const axios = require('axios');

// Criar usuário
const createUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/users', {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
};

// Buscar todos os produtos
const getAllProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/products');
    console.log(response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
};
```

## 🧪 Testando Cenários de Erro

### 1. Criar usuário com email duplicado

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "error": "Email já está em uso"
}
```

### 2. Criar produto com preço negativo

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição do produto",
    "price": -100,
    "stock": 10
  }'
```

**Resposta esperada:**
```json
{
  "error": "Preço não pode ser negativo"
}
```

### 3. Buscar usuário inexistente

```bash
curl http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000
```

**Resposta esperada:**
```json
{
  "error": "Usuário não encontrado"
}
```

## 📊 Monitoramento

Para verificar se a aplicação está funcionando corretamente:

1. **Health Check**: `GET /health`
2. **Logs do servidor**: Verifique o console onde o servidor está rodando
3. **Banco de dados**: Use o Drizzle Studio: `npm run studio`

## 🔍 Debugging

Se encontrar problemas:

1. Verifique se o PostgreSQL está rodando
2. Confirme se as migrações foram executadas
3. Verifique os logs do servidor
4. Teste o health check primeiro
5. Verifique se as variáveis de ambiente estão corretas 