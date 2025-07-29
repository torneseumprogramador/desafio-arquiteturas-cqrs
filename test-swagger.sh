#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testando Swagger UI...${NC}"

# Verificar se a aplicação está rodando
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo -e "${RED}❌ Aplicação não está rodando. Execute: npm start${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Aplicação está rodando${NC}"

# Testar Swagger UI
echo -e "${BLUE}📚 Testando Swagger UI...${NC}"
SWAGGER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api-docs)

if [ "$SWAGGER_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Swagger UI está funcionando!${NC}"
    echo -e "${BLUE}🌐 Acesse: http://localhost:3000/api-docs${NC}"
else
    echo -e "${RED}❌ Swagger UI não está funcionando (Status: $SWAGGER_RESPONSE)${NC}"
fi

# Testar alguns endpoints da API
echo -e "${BLUE}🧪 Testando endpoints da API...${NC}"

# Testar home
echo -e "${YELLOW}🏠 Testando / (Home)...${NC}"
curl -s http://localhost:3000/ | jq '.message' 2>/dev/null || echo "Resposta recebida"

# Testar health
echo -e "${YELLOW}🏥 Testando /health...${NC}"
curl -s http://localhost:3000/health | jq '.status' 2>/dev/null || echo "Resposta recebida"

# Testar users
echo -e "${YELLOW}👥 Testando /api/users...${NC}"
curl -s http://localhost:3000/api/users | jq 'length' 2>/dev/null || echo "Resposta recebida"

# Testar products
echo -e "${YELLOW}📦 Testando /api/products...${NC}"
curl -s http://localhost:3000/api/products | jq 'length' 2>/dev/null || echo "Resposta recebida"

# Testar orders
echo -e "${YELLOW}🛒 Testando /api/orders...${NC}"
curl -s http://localhost:3000/api/orders | jq 'length' 2>/dev/null || echo "Resposta recebida"

echo -e "${GREEN}🎉 Testes concluídos!${NC}"
echo -e "${BLUE}📚 Swagger UI: http://localhost:3000/api-docs${NC}"
echo -e "${BLUE}🏠 Home: http://localhost:3000/${NC}"
echo -e "${BLUE}🏥 Health: http://localhost:3000/health${NC}" 