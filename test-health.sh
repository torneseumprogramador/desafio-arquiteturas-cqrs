#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}🏥 Testando endpoints de Health Check...${NC}"
echo ""

# Teste 1: Health Check Geral
echo -e "${YELLOW}1. Health Check Geral (GET /health):${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo "$body"
fi
echo ""

# Teste 2: Ping
echo -e "${YELLOW}2. Ping (GET /health/ping):${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health/ping")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo "$body"
fi
echo ""

# Teste 3: Health Database
echo -e "${YELLOW}3. Health Database (GET /health/database):${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health/database")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo "$body"
fi
echo ""

# Teste 4: Health Detailed
echo -e "${YELLOW}4. Health Detailed (GET /health/detailed):${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health/detailed")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Status: $http_code${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}❌ Status: $http_code${NC}"
    echo "$body"
fi
echo ""

echo -e "${GREEN}✅ Testes de Health Check concluídos!${NC}" 