#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Verificando dados no banco de dados...${NC}"
echo ""

echo -e "${YELLOW}👥 Usuários:${NC}"
docker exec -it cqrs-postgres psql -U postgres -d cqrs_db -c "SELECT id, name, email, created_at FROM users;"

echo ""
echo -e "${YELLOW}📦 Produtos:${NC}"
docker exec -it cqrs-postgres psql -U postgres -d cqrs_db -c "SELECT id, name, price, stock, created_at FROM products;"

echo ""
echo -e "${YELLOW}🛒 Pedidos:${NC}"
docker exec -it cqrs-postgres psql -U postgres -d cqrs_db -c "SELECT id, user_id, status, total_amount, created_at FROM orders;"

echo ""
echo -e "${YELLOW}📋 Itens dos Pedidos:${NC}"
docker exec -it cqrs-postgres psql -U postgres -d cqrs_db -c "SELECT id, order_id, product_id, quantity, unit_price, total_price FROM order_products;"

echo ""
echo -e "${GREEN}✅ Verificação concluída!${NC}" 