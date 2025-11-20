#!/bin/bash
# Script pentru pornirea aplicației Curier pe Linux/Mac
# Autor: Generated for curier-app
# Data: 2025-11-20

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   🚚 Aplicație Curier - Starter      ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Culori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Verifică PostgreSQL
echo -e "${YELLOW}🔍 Verificare PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL găsit${NC}"
else
    echo -e "${RED}❌ PostgreSQL nu este găsit!${NC}"
    echo -e "${YELLOW}   Instalează PostgreSQL și creează baza de date 'curier_app'${NC}"
fi

# Verifică Java
echo -e "${YELLOW}🔍 Verificare Java...${NC}"
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | grep "version" | awk -F'"' '{print $2}')
    if [[ $JAVA_VERSION == 21.* ]]; then
        echo -e "${GREEN}✅ Java 21 găsit${NC}"
    else
        echo -e "${YELLOW}⚠️  Java găsit dar nu este versiunea 21!${NC}"
        echo -e "${YELLOW}   Versiune detectată: $JAVA_VERSION${NC}"
    fi
else
    echo -e "${RED}❌ Java nu este instalat sau nu este în PATH!${NC}"
    echo -e "${YELLOW}   Descarcă Java 21 de pe: https://adoptium.net/${NC}"
    exit 1
fi

# Verifică Node.js
echo -e "${YELLOW}🔍 Verificare Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION găsit${NC}"
else
    echo -e "${RED}❌ Node.js nu este instalat!${NC}"
    echo -e "${YELLOW}   Descarcă Node.js de pe: https://nodejs.org/${NC}"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════"

# Obține directorul scriptului
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Pornește backend
echo ""
echo -e "${GREEN}🚀 Pornesc backend-ul (Spring Boot)...${NC}"
echo -e "${WHITE}   Port: 8080${NC}"
echo -e "${WHITE}   Log: Terminal separat${NC}"

# Detectează terminalul disponibil
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR' && echo -e '${CYAN}🔥 Backend Starting...${NC}' && ./mvnw spring-boot:run; exec bash" &
elif command -v xterm &> /dev/null; then
    xterm -e "cd '$SCRIPT_DIR' && echo -e '${CYAN}🔥 Backend Starting...${NC}' && ./mvnw spring-boot:run; exec bash" &
elif command -v osascript &> /dev/null; then
    # macOS
    osascript -e "tell app \"Terminal\" to do script \"cd '$SCRIPT_DIR' && echo '🔥 Backend Starting...' && ./mvnw spring-boot:run\"" &
else
    echo -e "${YELLOW}⚠️  Nu s-a găsit terminal, backend va rula în fundal${NC}"
    cd "$SCRIPT_DIR" && ./mvnw spring-boot:run > backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${WHITE}   PID Backend: $BACKEND_PID${NC}"
fi

# Așteaptă backend
echo ""
echo -e "${YELLOW}⏳ Aștept pornirea backend-ului...${NC}"
echo -e "${WHITE}   Timp așteptare: 30 secunde${NC}"

for i in {30..1}; do
    echo -ne "\r${YELLOW}   Timp rămas: $i secunde  ${NC}"
    sleep 1
done
echo ""

# Verifică dacă backend-ul răspunde
echo ""
echo -e "${YELLOW}🔍 Verificare backend...${NC}"
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend pornit și răspunde!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend-ul nu răspunde încă (normal, mai are nevoie de timp)${NC}"
fi

# Verifică dependințele frontend
echo ""
echo -e "${YELLOW}🔍 Verificare dependințe frontend...${NC}"
if [ ! -d "$SCRIPT_DIR/curier-app-frontend/node_modules" ]; then
    echo -e "${CYAN}📦 Instalez dependințe frontend...${NC}"
    cd "$SCRIPT_DIR/curier-app-frontend"
    npm install
    cd "$SCRIPT_DIR"
    echo -e "${GREEN}✅ Dependințe instalate${NC}"
else
    echo -e "${GREEN}✅ Dependințe frontend OK${NC}"
fi

# Pornește frontend
echo ""
echo -e "${GREEN}🎨 Pornesc frontend-ul (React + Vite)...${NC}"
echo -e "${WHITE}   Port: 5174 (sau 5173)${NC}"
echo -e "${WHITE}   Log: Terminal separat${NC}"

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/curier-app-frontend' && echo -e '${CYAN}🎨 Frontend Starting...${NC}' && npm run dev; exec bash" &
elif command -v xterm &> /dev/null; then
    xterm -e "cd '$SCRIPT_DIR/curier-app-frontend' && echo -e '${CYAN}🎨 Frontend Starting...${NC}' && npm run dev; exec bash" &
elif command -v osascript &> /dev/null; then
    osascript -e "tell app \"Terminal\" to do script \"cd '$SCRIPT_DIR/curier-app-frontend' && echo '🎨 Frontend Starting...' && npm run dev\"" &
else
    echo -e "${YELLOW}⚠️  Nu s-a găsit terminal, frontend va rula în fundal${NC}"
    cd "$SCRIPT_DIR/curier-app-frontend" && npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${WHITE}   PID Frontend: $FRONTEND_PID${NC}"
fi

# Așteaptă frontend
echo ""
echo -e "${YELLOW}⏳ Aștept pornirea frontend-ului (5 secunde)...${NC}"
sleep 5

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║          ✅ APLICAȚIA PORNEȘTE        ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo -e "${CYAN}📱 Acesează aplicația:${NC}"
echo -e "${WHITE}   🌐 http://localhost:5174${NC}"
echo ""
echo -e "${CYAN}👤 Conturi demo:${NC}"
echo -e "${WHITE}   Client:  username: client1  | parolă: pass123${NC}"
echo -e "${WHITE}   Curier:  username: curier1  | parolă: pass123${NC}"
echo -e "${WHITE}   Admin:   username: admin    | parolă: admin123${NC}"
echo ""
echo -e "${CYAN}🔧 API Backend:${NC}"
echo -e "${WHITE}   🌐 http://localhost:8080${NC}"
echo ""
echo -e "${YELLOW}⚠️  Pentru a opri aplicația, închide terminalele backend și frontend${NC}"
echo ""
