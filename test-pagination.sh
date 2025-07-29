#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testando Paginação e Filtros...${NC}"

# Verificar se a aplicação está rodando
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo -e "${RED}❌ Aplicação não está rodando. Execute: npm start${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Aplicação está rodando${NC}"

# Criar alguns usuários de teste
echo -e "${BLUE}👥 Criando usuários de teste...${NC}"

curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com", "password": "123456"}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Santos", "email": "maria@email.com", "password": "123456"}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Pedro Oliveira", "email": "pedro@email.com", "password": "123456"}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana Costa", "email": "ana@email.com", "password": "123456"}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "Carlos Lima", "email": "carlos@email.com", "password": "123456"}' \
  -s > /dev/null

# Criar alguns produtos de teste
echo -e "${BLUE}📦 Criando produtos de teste...${NC}"

curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name": "iPhone 15", "description": "Smartphone Apple", "price": 5999.99, "stock": 50}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name": "Samsung Galaxy", "description": "Smartphone Samsung", "price": 3999.99, "stock": 30}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name": "MacBook Pro", "description": "Notebook Apple", "price": 12999.99, "stock": 20}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name": "Dell Inspiron", "description": "Notebook Dell", "price": 4999.99, "stock": 25}' \
  -s > /dev/null

curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name": "iPad Pro", "description": "Tablet Apple", "price": 7999.99, "stock": 15}' \
  -s > /dev/null

echo -e "${GREEN}✅ Dados de teste criados${NC}"

# Testar paginação de usuários
echo -e "${YELLOW}👥 Testando paginação de usuários...${NC}"

echo -e "${BLUE}📄 Página 1 (limite 2):${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?page=1&limit=2")
echo "Status: $(echo "$RESPONSE" | grep -o '"page":[0-9]*' | head -1)"
echo "Total: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"
echo "Itens: $(echo "$RESPONSE" | grep -o '"data":\[.*\]' | wc -c) caracteres"

echo -e "${BLUE}📄 Página 2 (limite 2):${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?page=2&limit=2")
echo "Status: $(echo "$RESPONSE" | grep -o '"page":[0-9]*' | head -1)"
echo "Total: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"

echo -e "${BLUE}🔍 Filtro por nome 'João':${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?name=João")
echo "Encontrados: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"
echo "Primeiro resultado: $(echo "$RESPONSE" | grep -o '"name":"[^"]*"' | head -1)"

echo -e "${BLUE}🔍 Filtro por nome 'Maria':${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?name=Maria")
echo "Encontrados: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"
echo "Primeiro resultado: $(echo "$RESPONSE" | grep -o '"name":"[^"]*"' | head -1)"

# Testar paginação de produtos
echo -e "${YELLOW}📦 Testando paginação de produtos...${NC}"

echo -e "${BLUE}📄 Página 1 (limite 2):${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/products?page=1&limit=2")
echo "Status: $(echo "$RESPONSE" | grep -o '"page":[0-9]*' | head -1)"
echo "Total: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"

echo -e "${BLUE}📄 Página 2 (limite 2):${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/products?page=2&limit=2")
echo "Status: $(echo "$RESPONSE" | grep -o '"page":[0-9]*' | head -1)"
echo "Total: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"

echo -e "${BLUE}🔍 Filtro por nome 'iPhone':${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/products?name=iPhone")
echo "Encontrados: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"
echo "Primeiro resultado: $(echo "$RESPONSE" | grep -o '"name":"[^"]*"' | head -1)"

echo -e "${BLUE}🔍 Filtro por nome 'MacBook':${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/products?name=MacBook")
echo "Encontrados: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"
echo "Primeiro resultado: $(echo "$RESPONSE" | grep -o '"name":"[^"]*"' | head -1)"

# Testar casos especiais
echo -e "${YELLOW}🧪 Testando casos especiais...${NC}"

echo -e "${BLUE}📄 Página inválida (deve retornar página 1):${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?page=0&limit=2")
echo "Página retornada: $(echo "$RESPONSE" | grep -o '"page":[0-9]*' | head -1)"

echo -e "${BLUE}📄 Limite inválido (deve usar padrão 10):${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?page=1&limit=0")
echo "Limite retornado: $(echo "$RESPONSE" | grep -o '"limit":[0-9]*' | head -1)"

echo -e "${BLUE}🔍 Filtro inexistente:${NC}"
RESPONSE=$(curl -s "http://localhost:3000/api/users?name=XYZ")
echo "Total encontrado: $(echo "$RESPONSE" | grep -o '"total":[0-9]*' | head -1)"

echo -e "${GREEN}🎉 Testes de paginação concluídos!${NC}"
echo -e "${BLUE}📚 Swagger UI: http://localhost:3000/api-docs${NC}"
echo -e "${BLUE}👥 Usuários: http://localhost:3000/api/users${NC}"
echo -e "${BLUE}📦 Produtos: http://localhost:3000/api/products${NC}" 