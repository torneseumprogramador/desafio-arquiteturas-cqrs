#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Configurando pgAdmin...${NC}"

# Aguardar pgAdmin estar pronto
echo -e "${YELLOW}⏳ Aguardando pgAdmin estar pronto...${NC}"
sleep 20

# Verificar se pgAdmin está respondendo
if ! curl -s http://localhost:8081 > /dev/null; then
    echo -e "${RED}❌ pgAdmin não está respondendo${NC}"
    exit 1
fi

echo -e "${GREEN}✅ pgAdmin está rodando!${NC}"
echo ""
echo -e "${BLUE}📊 Acesse o pgAdmin:${NC}"
echo -e "${GREEN}🌐 URL: http://localhost:8081${NC}"
echo -e "${BLUE}👤 Login: admin@admin.com${NC}"
echo -e "${BLUE}🔑 Senha: admin${NC}"
echo ""
echo -e "${YELLOW}📋 Para conectar ao PostgreSQL:${NC}"
echo -e "${YELLOW}1. Faça login no pgAdmin${NC}"
echo -e "${YELLOW}2. Clique com botão direito em 'Servers'${NC}"
echo -e "${YELLOW}3. Selecione 'Register' > 'Server...'${NC}"
echo -e "${YELLOW}4. Na aba 'General':${NC}"
echo -e "${YELLOW}   - Name: CQRS PostgreSQL${NC}"
echo -e "${YELLOW}5. Na aba 'Connection':${NC}"
echo -e "${YELLOW}   - Host name/address: postgres${NC}"
echo -e "${YELLOW}   - Port: 5432${NC}"
echo -e "${YELLOW}   - Maintenance database: cqrs_db${NC}"
echo -e "${YELLOW}   - Username: postgres${NC}"
echo -e "${YELLOW}   - Password: postgres${NC}"
echo -e "${YELLOW}6. Clique em 'Save'${NC}"
echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}" 