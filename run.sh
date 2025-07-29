#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}📖 Uso do script:${NC}"
    echo -e "  ${GREEN}./run.sh${NC}                    - Executa tudo (Docker + Build + Run)"
    echo -e "  ${GREEN}./run.sh build${NC}              - Apenas npm run build"
    echo -e "  ${GREEN}./run.sh clean${NC}              - Apenas npm run clean"
    echo -e "  ${GREEN}./run.sh install${NC}            - Instala dependências"
    echo -e "  ${GREEN}./run.sh docker${NC}             - Apenas inicia Docker (PostgreSQL)"
    echo -e "  ${GREEN}./run.sh docker-stop${NC}        - Para containers Docker"
    echo -e "  ${GREEN}./run.sh run${NC}                - Apenas executa a API"
    echo -e "  ${GREEN}./run.sh stop${NC}               - Para a API Node.js"
    echo -e "  ${GREEN}./run.sh dev${NC}                - Executa em modo desenvolvimento"
    echo -e "  ${GREEN}./run.sh migrate${NC}            - Executa migrações do banco"
    echo -e "  ${GREEN}./run.sh studio${NC}             - Abre Drizzle Studio"
    echo -e "  ${GREEN}./run.sh check-db${NC}           - Verifica dados no banco"
    echo -e "  ${GREEN}./run.sh test-health${NC}        - Testa endpoints de health"
    echo -e "  ${GREEN}./run.sh help${NC}               - Mostra esta ajuda"
    echo ""
    echo -e "${YELLOW}💡 Exemplos:${NC}"
    echo -e "  ${GREEN}./run.sh build${NC}              - Para fazer apenas o build"
    echo -e "  ${GREEN}./run.sh docker && ./run.sh build${NC} - Inicia Docker e depois faz build"
}

# Verificar se o Node.js está instalado
check_node() {
    if ! node --version > /dev/null 2>&1; then
        echo -e "${RED}❌ Node.js não está instalado. Por favor, instale o Node.js 18+ e tente novamente.${NC}"
        exit 1
    fi
    
    # Verifica se é Node.js 18 ou superior
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ é necessário. Versão atual: $NODE_VERSION${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js v$(node --version) detectado${NC}"
}

# Verificar se o npm está instalado
check_npm() {
    if ! npm --version > /dev/null 2>&1; then
        echo -e "${RED}❌ npm não está instalado. Por favor, instale o npm e tente novamente.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ npm v$(npm --version) detectado${NC}"
}

# Verificar se o Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente.${NC}"
        exit 1
    fi
}

# Função para verificar se o PostgreSQL já está rodando
check_postgres_running() {
    if nc -z localhost 5432 2>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL já está rodando!${NC}"
        return 0
    fi
    return 1
}

# Função para iniciar Docker
start_docker() {
    # Verifica se já está rodando
    if check_postgres_running; then
        return 0
    fi
    
    echo -e "${YELLOW}🐳 Iniciando PostgreSQL...${NC}"
    docker-compose up -d
    
    echo -e "${YELLOW}⏳ Aguardando PostgreSQL estar pronto...${NC}"
    sleep 15
    
    echo -e "${YELLOW}🔍 Verificando conexão com PostgreSQL...${NC}"
    for i in {1..20}; do
        # Verifica se a porta está respondendo
        if nc -z localhost 5432 2>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL está pronto! (Porta 5432 respondendo)${NC}"
            echo -e "${BLUE}📊 Banco de dados: cqrs_db${NC}"
            echo -e "${BLUE}👤 Usuário: postgres${NC}"
            echo -e "${BLUE}🔑 Senha: postgres${NC}"
            return 0
        fi
        
        if [ $i -eq 20 ]; then
            echo -e "${RED}❌ Timeout aguardando PostgreSQL${NC}"
            echo -e "${YELLOW}💡 Dica: Verifique se o Docker está rodando e tente novamente${NC}"
            return 1
        fi
        echo -e "${YELLOW}⏳ Tentativa $i/20...${NC}"
        sleep 3
    done
}

# Função para executar a API
run_api() {
    echo -e "${GREEN}🎯 Iniciando a API Node.js CQRS...${NC}"
    echo -e "${BLUE}📱 A API estará disponível em: http://localhost:3000${NC}"
    echo -e "${BLUE}📚 Endpoints disponíveis:${NC}"
    echo -e "${BLUE}   - POST /api/users${NC}"
    echo -e "${BLUE}   - GET /api/users${NC}"
    echo -e "${BLUE}   - GET /api/users/:id${NC}"
    echo -e "${BLUE}   - POST /api/products${NC}"
    echo -e "${BLUE}   - GET /api/products${NC}"
    echo -e "${BLUE}   - GET /api/products/:id${NC}"
    echo -e "${BLUE}   - GET /health${NC}"
    echo -e "${YELLOW}⏹️ Pressione Ctrl+C para parar${NC}"
    
    npm run dev
}

# Verificar argumentos
case "${1:-}" in
    "build")
        echo -e "${BLUE}🔨 Executando npm run build...${NC}"
        check_node
        check_npm
        npm run build
        ;;
    "clean")
        echo -e "${BLUE}🧹 Executando limpeza...${NC}"
        check_npm
        rm -rf dist/
        rm -rf node_modules/
        echo -e "${GREEN}✅ Limpeza concluída${NC}"
        ;;
    "install")
        echo -e "${BLUE}📦 Instalando dependências...${NC}"
        check_node
        check_npm
        npm install
        ;;
    "docker")
        echo -e "${BLUE}🐳 Iniciando Docker...${NC}"
        check_docker
        
        # Verifica se já está rodando
        if check_postgres_running; then
            echo -e "${YELLOW}ℹ️ PostgreSQL já está rodando, não é necessário reiniciar${NC}"
            exit 0
        fi
        
        # Se não estiver rodando, para containers e inicia
        docker-compose down
        start_docker
        ;;
    "docker-stop")
        echo -e "${BLUE}🛑 Parando Docker...${NC}"
        docker-compose down
        ;;
    "run")
        echo -e "${BLUE}🎯 Executando API...${NC}"
        check_node
        check_npm
        run_api
        ;;
    "stop")
        echo -e "${BLUE}🛑 Parando API Node.js...${NC}"
        
        # Procura por processos Node.js que estão rodando a aplicação
        PIDS=$(ps aux | grep "ts-node-dev\|node.*main.js" | grep -v grep | awk '{print $2}')
        
        if [ -z "$PIDS" ]; then
            echo -e "${YELLOW}ℹ️ Nenhuma aplicação Node.js encontrada rodando${NC}"
            exit 0
        fi
        
        echo -e "${YELLOW}🔍 Encontrados processos: $PIDS${NC}"
        
        for PID in $PIDS; do
            echo -e "${YELLOW}🛑 Parando processo $PID...${NC}"
            kill $PID
            
            # Aguarda um pouco e verifica se parou
            sleep 2
            if ps -p $PID > /dev/null 2>&1; then
                echo -e "${RED}⚠️ Processo $PID não parou, forçando...${NC}"
                kill -9 $PID
            else
                echo -e "${GREEN}✅ Processo $PID parado com sucesso${NC}"
            fi
        done
        
        echo -e "${GREEN}✅ API Node.js parada${NC}"
        ;;
    "dev")
        echo -e "${BLUE}👀 Executando em modo desenvolvimento...${NC}"
        check_node
        check_npm
        run_api
        ;;
    "migrate")
        echo -e "${BLUE}🗄️ Executando migrações...${NC}"
        check_node
        check_npm
        npx drizzle-kit generate
        npx drizzle-kit up
        ;;
    "studio")
        echo -e "${BLUE}📊 Abrindo Drizzle Studio...${NC}"
        check_node
        check_npm
        npx drizzle-kit studio
        ;;
    "studio")
        echo -e "${BLUE}📊 Abrindo Drizzle Studio...${NC}"
        echo -e "${GREEN}🌐 Acesse: https://local.drizzle.studio${NC}"
        echo -e "${YELLOW}📊 Database: PostgreSQL${NC}"
        echo -e "${YELLOW}📊 URL: postgresql://postgres:postgres@localhost:5432/cqrs_db${NC}"
        ;;
    "check-db")
        echo -e "${BLUE}📊 Verificando dados no banco...${NC}"
        ./check-db.sh
        ;;
    "test-health")
        echo -e "${BLUE}🏥 Testando endpoints de health...${NC}"
        ./test-health.sh
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        # Execução completa (comportamento padrão)
        echo -e "${BLUE}🚀 Iniciando Ecommerce CQRS Architecture...${NC}"
        
        check_docker
        check_node
        check_npm
        echo -e "${GREEN}✅ Docker, Node.js 18+ e npm verificados${NC}"
        
        # Iniciar Docker (só para containers se necessário)
        if ! start_docker; then
            exit 1
        fi
        
        # Instalar dependências se necessário
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📦 Instalando dependências...${NC}"
            npm install
        fi
        
        # Verificar se o arquivo .env existe
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}⚙️ Criando arquivo .env...${NC}"
            cp env.example .env
            echo -e "${GREEN}✅ Arquivo .env criado. Configure as variáveis se necessário.${NC}"
        fi
        
        # Executar migrações
        echo -e "${YELLOW}🗄️ Executando migrações...${NC}"
        npx drizzle-kit generate
        npx drizzle-kit up
        
        echo -e "${GREEN}✅ Migrações concluídas!${NC}"
        
        # Executar a aplicação
        run_api
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac 