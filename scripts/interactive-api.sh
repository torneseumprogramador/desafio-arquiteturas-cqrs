#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# URL base da API
API_URL="http://localhost:3000/api"

# Função para exibir título
show_title() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              🛒 SISTEMA E-COMMERCE HEXAGONAL                 ║"
    echo "║                Arquitetura Hexagonal (Ports & Adapters)      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Função para exibir menu
show_menu() {
    echo -e "${YELLOW}"
    echo "┌──────────────────────────────────────────────────────────────┐"
    echo "│                        MENU PRINCIPAL                        │"
    echo "├──────────────────────────────────────────────────────────────┤"
    echo "│  1. 👥 Listar usuários cadastrados                           │"
    echo "│  2. 👤 Cadastrar novo usuário                                │"
    echo "│  3. ✏️  Atualizar usuário                                    │"
    echo "│  4. 🗑️  Deletar usuário                                      │"
    echo "│  5. 📦 Listar produtos disponíveis                           │"
    echo "│  6. 🆕 Cadastrar novo produto                                │"
    echo "│  7. ✏️  Atualizar produto                                    │"
    echo "│  8. 🗑️  Deletar produto                                      │"
    echo "│  9. 🛒 Criar novo pedido                                     │"
    echo "│ 10. 📊 Visualizar pedidos existentes                         │"
    echo "│ 11. ✏️  Atualizar pedido                                     │"
    echo "│ 12. 🗑️  Deletar pedido                                       │"
    echo "│ 13. 💚 Verificar saúde da API                                │"
    echo "│ 14. 📚 Abrir documentação Swagger                            │"
    echo "│  0. 🚪 Sair                                                  │"
    echo "└──────────────────────────────────────────────────────────────┘"
    echo -e "${NC}"
}

# Função para validar se a API está rodando
check_api() {
    echo -e "${BLUE}🔍 Verificando se a API está rodando...${NC}"
    
    if curl -s "http://localhost:3000/health/ping" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API está rodando!${NC}"
        return 0
    else
        echo -e "${RED}❌ API não está rodando!${NC}"
        echo -e "${YELLOW}💡 Execute './run.sh' para iniciar a aplicação${NC}"
        return 1
    fi
}

# Função para listar usuários
list_users() {
    echo -e "${BLUE}👥 Listando usuários cadastrados...${NC}"
    
    response=$(curl -s "$API_URL/users")
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        echo -e "${GREEN}✅ Usuários encontrados:${NC}"
        echo "$response" | jq -r '.data[] | "ID: \(.id) | Nome: \(.name) | Email: \(.email)"'
    else
        echo -e "${YELLOW}⚠️  Nenhum usuário cadastrado ou erro na consulta${NC}"
    fi
}

# Função para cadastrar novo usuário
register_user() {
    echo -e "${BLUE}👤 Cadastrando novo usuário...${NC}"
    
    read -p "Nome completo: " name
    read -p "Email: " email
    read -p "Senha: " password
    
    # Validações básicas
    if [ -z "$name" ] || [ -z "$email" ] || [ -z "$password" ]; then
        echo -e "${RED}❌ Todos os campos são obrigatórios!${NC}"
        return 1
    fi
    
    # Validar tamanho da senha
    if [ ${#password} -lt 6 ]; then
        echo -e "${RED}❌ Senha deve ter pelo menos 6 caracteres!${NC}"
        return 1
    fi
    
    # Criar JSON
    json_data="{
        \"name\": \"$name\",
        \"email\": \"$email\",
        \"password\": \"$password\"
    }"
    
    # Enviar requisição
    response=$(curl -s -X POST "$API_URL/users" \
        -H "Content-Type: application/json" \
        -d "$json_data")
    
    # Verificar se a resposta contém erro
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        error_msg=$(echo "$response" | jq -r '.error')
        echo -e "${RED}❌ Erro ao cadastrar: $error_msg${NC}"
        return 1
    elif echo "$response" | jq -e '.user.id' > /dev/null 2>&1; then
        user_id=$(echo "$response" | jq -r '.user.id')
        echo -e "${GREEN}✅ Usuário cadastrado com sucesso!${NC}"
        echo -e "${CYAN}ID: $user_id${NC}"
        return 0
    else
        echo -e "${RED}❌ Erro desconhecido na resposta da API${NC}"
        echo -e "${YELLOW}Resposta: $response${NC}"
        return 1
    fi
}

# Função para atualizar usuário
update_user() {
    echo -e "${BLUE}✏️  Atualizando usuário...${NC}"
    
    # Listar usuários primeiro
    list_users
    
    read -p "Digite o ID do usuário: " user_id
    
    if [ -z "$user_id" ]; then
        echo -e "${RED}❌ ID é obrigatório!${NC}"
        return 1
    fi
    
    read -p "Nome completo: " name
    read -p "Email: " email
    read -p "Senha: " password
    
    # Validações básicas
    if [ -z "$name" ] || [ -z "$email" ] || [ -z "$password" ]; then
        echo -e "${RED}❌ Todos os campos são obrigatórios!${NC}"
        return 1
    fi
    
    # Validar tamanho da senha
    if [ ${#password} -lt 6 ]; then
        echo -e "${RED}❌ Senha deve ter pelo menos 6 caracteres!${NC}"
        return 1
    fi
    
    # Criar JSON
    json_data="{
        \"name\": \"$name\",
        \"email\": \"$email\",
        \"password\": \"$password\"
    }"
    
    # Enviar requisição
    response=$(curl -s -X PUT "$API_URL/users/$user_id" \
        -H "Content-Type: application/json" \
        -d "$json_data")
    
    # Verificar se a resposta contém erro
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        error_msg=$(echo "$response" | jq -r '.error')
        echo -e "${RED}❌ Erro ao atualizar: $error_msg${NC}"
        return 1
    elif echo "$response" | jq -e '.user.id' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Usuário atualizado com sucesso!${NC}"
        echo -e "${CYAN}ID: $user_id${NC}"
        return 0
    else
        echo -e "${RED}❌ Erro desconhecido na resposta da API${NC}"
        echo -e "${YELLOW}Resposta: $response${NC}"
        return 1
    fi
}

# Função para deletar usuário
delete_user() {
    echo -e "${BLUE}🗑️  Deletando usuário...${NC}"
    
    # Listar usuários primeiro
    list_users
    
    read -p "Digite o ID do usuário: " user_id
    
    if [ -z "$user_id" ]; then
        echo -e "${RED}❌ ID é obrigatório!${NC}"
        return 1
    fi
    
    read -p "Tem certeza que deseja deletar o usuário $user_id? (s/N): " confirm
    
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
        # Enviar requisição
        response=$(curl -s -X DELETE "$API_URL/users/$user_id")
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Usuário deletado com sucesso!${NC}"
            return 0
        else
            echo -e "${RED}❌ Erro ao deletar usuário${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}❌ Operação cancelada${NC}"
        return 1
    fi
}

# Função para listar produtos
list_products() {
    echo -e "${BLUE}📦 Listando produtos disponíveis...${NC}"
    
    response=$(curl -s "$API_URL/products")
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        echo -e "${GREEN}✅ Produtos encontrados:${NC}"
        echo "$response" | jq -r '.data[] | "ID: \(.id) | Nome: \(.name) | Preço: R$ \(.price) | Estoque: \(.stock) | Descrição: \(.description)"'
    else
        echo -e "${YELLOW}⚠️  Nenhum produto cadastrado ou erro na consulta${NC}"
    fi
}

# Função para cadastrar novo produto
register_product() {
    echo -e "${BLUE}🆕 Cadastrando novo produto...${NC}"
    
    read -p "Nome do produto: " name
    read -p "Descrição: " description
    read -p "Preço (ex: 99.99): " price
    read -p "Quantidade em estoque: " stock_quantity
    
    # Validações básicas
    if [ -z "$name" ] || [ -z "$description" ] || [ -z "$price" ] || [ -z "$stock_quantity" ]; then
        echo -e "${RED}❌ Todos os campos são obrigatórios!${NC}"
        return 1
    fi
    
    # Validar se price é um número
    if ! [[ "$price" =~ ^[0-9]+\.?[0-9]*$ ]]; then
        echo -e "${RED}❌ Preço deve ser um número válido!${NC}"
        return 1
    fi
    
    # Validar se stock_quantity é um número
    if ! [[ "$stock_quantity" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}❌ Quantidade deve ser um número inteiro!${NC}"
        return 1
    fi
    
    # Criar JSON
    json_data="{
        \"name\": \"$name\",
        \"description\": \"$description\",
        \"price\": $price,
        \"stock\": $stock_quantity
    }"
    
    # Enviar requisição
    response=$(curl -s -X POST "$API_URL/products" \
        -H "Content-Type: application/json" \
        -d "$json_data")
    
    # Verificar se a resposta contém erro
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        error_msg=$(echo "$response" | jq -r '.error')
        echo -e "${RED}❌ Erro ao cadastrar: $error_msg${NC}"
        return 1
    elif echo "$response" | jq -e '.product.id' > /dev/null 2>&1; then
        product_id=$(echo "$response" | jq -r '.product.id')
        echo -e "${GREEN}✅ Produto cadastrado com sucesso!${NC}"
        echo -e "${CYAN}ID: $product_id${NC}"
        return 0
    else
        echo -e "${RED}❌ Erro desconhecido na resposta da API${NC}"
        echo -e "${YELLOW}Resposta: $response${NC}"
        return 1
    fi
}

# Função para atualizar produto
update_product() {
    echo -e "${BLUE}✏️  Atualizando produto...${NC}"
    
    # Listar produtos primeiro
    list_products
    
    read -p "Digite o ID do produto: " product_id
    
    if [ -z "$product_id" ]; then
        echo -e "${RED}❌ ID é obrigatório!${NC}"
        return 1
    fi
    
    read -p "Nome do produto: " name
    read -p "Descrição: " description
    read -p "Preço (ex: 99.99): " price
    read -p "Quantidade em estoque: " stock_quantity
    
    # Validações básicas
    if [ -z "$name" ] || [ -z "$description" ] || [ -z "$price" ] || [ -z "$stock_quantity" ]; then
        echo -e "${RED}❌ Todos os campos são obrigatórios!${NC}"
        return 1
    fi
    
    # Validar se price é um número
    if ! [[ "$price" =~ ^[0-9]+\.?[0-9]*$ ]]; then
        echo -e "${RED}❌ Preço deve ser um número válido!${NC}"
        return 1
    fi
    
    # Validar se stock_quantity é um número
    if ! [[ "$stock_quantity" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}❌ Quantidade deve ser um número inteiro!${NC}"
        return 1
    fi
    
    # Criar JSON
    json_data="{
        \"name\": \"$name\",
        \"description\": \"$description\",
        \"price\": $price,
        \"stock\": $stock_quantity
    }"
    
    # Enviar requisição
    response=$(curl -s -X PUT "$API_URL/products/$product_id" \
        -H "Content-Type: application/json" \
        -d "$json_data")
    
    # Verificar se a resposta contém erro
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        error_msg=$(echo "$response" | jq -r '.error')
        echo -e "${RED}❌ Erro ao atualizar: $error_msg${NC}"
        return 1
    elif echo "$response" | jq -e '.product.id' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Produto atualizado com sucesso!${NC}"
        echo -e "${CYAN}ID: $product_id${NC}"
        return 0
    else
        echo -e "${RED}❌ Erro desconhecido na resposta da API${NC}"
        echo -e "${YELLOW}Resposta: $response${NC}"
        return 1
    fi
}

# Função para deletar produto
delete_product() {
    echo -e "${BLUE}🗑️  Deletando produto...${NC}"
    
    # Listar produtos primeiro
    list_products
    
    read -p "Digite o ID do produto: " product_id
    
    if [ -z "$product_id" ]; then
        echo -e "${RED}❌ ID é obrigatório!${NC}"
        return 1
    fi
    
    read -p "Tem certeza que deseja deletar o produto $product_id? (s/N): " confirm
    
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
        # Enviar requisição
        response=$(curl -s -X DELETE "$API_URL/products/$product_id")
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Produto deletado com sucesso!${NC}"
            return 0
        else
            echo -e "${RED}❌ Erro ao deletar produto${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}❌ Operação cancelada${NC}"
        return 1
    fi
}

# Função para selecionar usuário
select_user() {
    echo -e "${BLUE}👤 Selecionando usuário para o pedido...${NC}"
    
    # Listar usuários
    response=$(curl -s "$API_URL/users")
    
    if [ $? -ne 0 ] || [ -z "$response" ]; then
        echo -e "${YELLOW}⚠️  Nenhum usuário cadastrado. Vamos cadastrar um novo!${NC}"
        register_user
        if [ $? -eq 0 ]; then
            # Buscar o usuário recém cadastrado
            response=$(curl -s "$API_URL/users")
        else
            return 1
        fi
    fi
    
    # Mostrar usuários disponíveis
    echo -e "${GREEN}📋 Usuários disponíveis:${NC}"
    echo "$response" | jq -r '.data[] | "\(.id) | \(.name) | \(.email)"'
    
    echo -e "${YELLOW}Opções:${NC}"
    echo "1. Selecionar usuário existente"
    echo "2. Cadastrar novo usuário"
    read -p "Escolha: " option
    
    case $option in
        1)
            read -p "Digite o ID do usuário: " user_id
            # Validar se o ID existe
            if echo "$response" | jq -e ".data[] | select(.id == \"$user_id\")" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Usuário selecionado!${NC}"
                return 0
            else
                echo -e "${RED}❌ ID inválido!${NC}"
                return 1
            fi
            ;;
        2)
            register_user
            if [ $? -eq 0 ]; then
                # Buscar o usuário recém cadastrado
                response=$(curl -s "$API_URL/users")
                user_id=$(echo "$response" | jq -r '.data[-1].id')
                echo -e "${GREEN}✅ Novo usuário selecionado!${NC}"
                return 0
            else
                return 1
            fi
            ;;
        *)
            echo -e "${RED}❌ Opção inválida!${NC}"
            return 1
            ;;
    esac
}

# Função para selecionar produtos
select_products() {
    echo -e "${BLUE}📦 Selecionando produtos para o pedido...${NC}"
    
    # Listar produtos
    response=$(curl -s "$API_URL/products")
    
    if [ $? -ne 0 ] || [ -z "$response" ]; then
        echo -e "${RED}❌ Nenhum produto cadastrado!${NC}"
        echo -e "${YELLOW}💡 Cadastre produtos primeiro usando a opção 6${NC}"
        return 1
    fi
    
    # Mostrar produtos disponíveis
    echo -e "${GREEN}📦 Produtos disponíveis:${NC}"
    echo "$response" | jq -r '.data[] | "\(.id) | \(.name) | R$ \(.price) | Estoque: \(.stock)"'
    
    products_json="{}"
    
    while true; do
        echo -e "${YELLOW}Adicionar produto ao pedido:${NC}"
        read -p "Digite o ID do produto (ou '0' para finalizar): " product_id
        
        if [ "$product_id" = "0" ]; then
            break
        fi
        
        # Validar se o produto existe
        if echo "$response" | jq -e ".data[] | select(.id == \"$product_id\")" > /dev/null 2>&1; then
            read -p "Quantidade: " quantity
            
            if [[ "$quantity" =~ ^[0-9]+$ ]] && [ "$quantity" -gt 0 ]; then
                # Verificar estoque
                stock=$(echo "$response" | jq -r ".data[] | select(.id == \"$product_id\") | .stock")
                if [ "$quantity" -le "$stock" ]; then
                    # Adicionar produto ao JSON
                    products_json=$(echo "$products_json" | jq ". + {\"$product_id\": $quantity}")
                    echo -e "${GREEN}✅ Produto adicionado!${NC}"
                else
                    echo -e "${RED}❌ Quantidade excede o estoque disponível ($stock)${NC}"
                fi
            else
                echo -e "${RED}❌ Quantidade inválida!${NC}"
            fi
        else
            echo -e "${RED}❌ ID de produto inválido!${NC}"
        fi
    done
    
    # Verificar se há produtos no pedido
    product_count=$(echo "$products_json" | jq 'keys | length')
    if [ "$product_count" -eq 0 ]; then
        echo -e "${RED}❌ Pedido deve ter pelo menos um produto!${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Produtos selecionados: $product_count produto(s)${NC}"
    return 0
}

# Função para criar pedido
create_order() {
    echo -e "${BLUE}🛒 Criando novo pedido...${NC}"
    
    # Selecionar usuário
    select_user
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Selecionar produtos
    select_products
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Converter products_json para array de produtos
    products_array=$(echo "$products_json" | jq -r 'to_entries | map({"productId": .key, "quantity": .value})')
    
    # Criar JSON do pedido
    order_json="{
        \"userId\": \"$user_id\",
        \"products\": $products_array
    }"
    
    echo -e "${YELLOW}📋 Resumo do pedido:${NC}"
    echo "$order_json" | jq '.'
    
    read -p "Confirmar pedido? (s/N): " confirm
    
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
        # Enviar requisição
        response=$(curl -s -X POST "$API_URL/orders" \
            -H "Content-Type: application/json" \
            -d "$order_json")
        
        # Verificar se a resposta contém erro
        if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
            error_msg=$(echo "$response" | jq -r '.error')
            echo -e "${RED}❌ Erro ao criar pedido: $error_msg${NC}"
            return 1
        elif echo "$response" | jq -e '.order.id' > /dev/null 2>&1; then
            order_id=$(echo "$response" | jq -r '.order.id')
            total_amount=$(echo "$response" | jq -r '.order.totalAmount')
            echo -e "${GREEN}✅ Pedido criado com sucesso!${NC}"
            echo -e "${CYAN}ID do Pedido: $order_id${NC}"
            echo -e "${CYAN}Valor Total: R$ $total_amount${NC}"
            
            # Mostrar detalhes do pedido
            echo -e "${BLUE}📋 Detalhes do pedido:${NC}"
            echo "$response" | jq -r '.'
        else
            echo -e "${RED}❌ Erro desconhecido na resposta da API${NC}"
            echo -e "${YELLOW}Resposta: $response${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}❌ Pedido cancelado${NC}"
        return 1
    fi
}

# Função para visualizar pedidos
view_orders() {
    echo -e "${BLUE}📊 Visualizando pedidos existentes...${NC}"
    
    response=$(curl -s "$API_URL/orders")
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        echo -e "${GREEN}✅ Pedidos encontrados:${NC}"
        echo "$response" | jq -r '.orders[] | "ID: \(.id) | Usuário: \(.userId) | Status: \(.status) | Total: R$ \(.totalAmount) | Data: \(.createdAt)"'
    else
        echo -e "${YELLOW}⚠️  Nenhum pedido encontrado${NC}"
    fi
}

# Função para atualizar pedido
update_order() {
    echo -e "${BLUE}✏️  Atualizando pedido...${NC}"
    
    # Listar pedidos primeiro
    view_orders
    
    read -p "Digite o ID do pedido: " order_id
    
    if [ -z "$order_id" ]; then
        echo -e "${RED}❌ ID é obrigatório!${NC}"
        return 1
    fi
    
    # Selecionar usuário
    select_user
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Selecionar produtos
    select_products
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Converter products_json para array de produtos
    products_array=$(echo "$products_json" | jq -r 'to_entries | map({"productId": .key, "quantity": .value})')
    
    # Criar JSON do pedido
    order_json="{
        \"userId\": \"$user_id\",
        \"products\": $products_array
    }"
    
    echo -e "${YELLOW}📋 Resumo da atualização:${NC}"
    echo "$order_json" | jq '.'
    
    read -p "Confirmar atualização? (s/N): " confirm
    
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
        # Enviar requisição
        response=$(curl -s -X PUT "$API_URL/orders/$order_id" \
            -H "Content-Type: application/json" \
            -d "$order_json")
        
        # Verificar se a resposta contém erro
        if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
            error_msg=$(echo "$response" | jq -r '.error')
            echo -e "${RED}❌ Erro ao atualizar: $error_msg${NC}"
            return 1
        elif echo "$response" | jq -e '.order.id' > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Pedido atualizado com sucesso!${NC}"
            echo -e "${CYAN}ID: $order_id${NC}"
            
            # Mostrar detalhes do pedido
            echo -e "${BLUE}📋 Detalhes do pedido:${NC}"
            echo "$response" | jq -r '.'
        else
            echo -e "${RED}❌ Erro desconhecido na resposta da API${NC}"
            echo -e "${YELLOW}Resposta: $response${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}❌ Atualização cancelada${NC}"
        return 1
    fi
}

# Função para deletar pedido
delete_order() {
    echo -e "${BLUE}🗑️  Deletando pedido...${NC}"
    
    # Listar pedidos primeiro
    view_orders
    
    read -p "Digite o ID do pedido: " order_id
    
    if [ -z "$order_id" ]; then
        echo -e "${RED}❌ ID é obrigatório!${NC}"
        return 1
    fi
    
    read -p "Tem certeza que deseja deletar o pedido $order_id? (s/N): " confirm
    
    if [[ "$confirm" =~ ^[Ss]$ ]]; then
        # Enviar requisição
        response=$(curl -s -X DELETE "$API_URL/orders/$order_id")
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Pedido deletado com sucesso!${NC}"
            return 0
        else
            echo -e "${RED}❌ Erro ao deletar pedido${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}❌ Operação cancelada${NC}"
        return 1
    fi
}

# Função para verificar saúde da API
check_health() {
    echo -e "${BLUE}💚 Verificando saúde da API...${NC}"
    
    # Health geral
    echo -e "${CYAN}📊 Status Geral:${NC}"
    health_response=$(curl -s "http://localhost:3000/health")
    echo "$health_response" | jq '.'
    
    echo
    
    # Health do banco de dados
    echo -e "${CYAN}🗄️ Status do Banco de Dados:${NC}"
    db_health_response=$(curl -s "http://localhost:3000/health/database")
    echo "$db_health_response" | jq '.'
    
    echo
    
    # Ping
    echo -e "${CYAN}🏓 Ping:${NC}"
    ping_response=$(curl -s "http://localhost:3000/health/ping")
    echo "$ping_response" | jq '.'
}

# Função para abrir documentação Swagger
open_swagger() {
    echo -e "${BLUE}📚 Abrindo documentação Swagger...${NC}"
    echo -e "${CYAN}🌐 URL: http://localhost:3000/swagger-ui.html${NC}"
    echo -e "${YELLOW}💡 Abra o link acima no seu navegador${NC}"
    # Tentar abrir no navegador automaticamente
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "http://localhost:3000/swagger-ui.html"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start "http://localhost:3000/swagger-ui.html"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "http://localhost:3000/swagger-ui.html" || \
        sensible-browser "http://localhost:3000/swagger-ui.html" || \
        x-www-browser "http://localhost:3000/swagger-ui.html"
    fi
}

# Função principal
main() {
    show_title
    
    # Verificar se a API está rodando
    if ! check_api; then
        exit 1
    fi
    
    while true; do
        echo
        show_menu
        read -p "Escolha uma opção: " choice
        
        case $choice in
            1)
                list_users
                ;;
            2)
                register_user
                ;;
            3)
                update_user
                ;;
            4)
                delete_user
                ;;
            5)
                list_products
                ;;
            6)
                register_product
                ;;
            7)
                update_product
                ;;
            8)
                delete_product
                ;;
            9)
                create_order
                ;;
            10)
                view_orders
                ;;
            11)
                update_order
                ;;
            12)
                delete_order
                ;;
            13)
                check_health
                ;;
            14)
                open_swagger
                ;;
            0)
                echo -e "${GREEN}👋 Obrigado por usar o Sistema E-commerce Hexagonal!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opção inválida!${NC}"
                ;;
        esac
        
        echo
        read -p "Pressione ENTER para continuar..."
    done
}

# Executar função principal
main 