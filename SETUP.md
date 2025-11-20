# Ghid de Instalare - Aplicație Curier

Acest ghid te va ajuta să rulezi aplicația pe orice laptop.

## 📋 Prerequisite

### 1. Java 21 (LTS)
- Descarcă și instalează [Eclipse Adoptium JDK 21](https://adoptium.net/temurin/releases/?version=21)
- Verifică instalarea: `java -version` (trebuie să afișeze versiunea 21.x.x)

### 2. Maven 3.9+
- Descarcă de pe [maven.apache.org](https://maven.apache.org/download.cgi)
- SAU folosește maven wrapper-ul inclus în proiect (recomandat)

### 3. PostgreSQL 18+
- Descarcă și instalează [PostgreSQL](https://www.postgresql.org/download/)
- Notează parola pentru utilizatorul `postgres`

### 4. Node.js 18+ și npm
- Descarcă de pe [nodejs.org](https://nodejs.org/)
- Verifică instalarea: `node -v` și `npm -v`

### 5. Git
- Descarcă de pe [git-scm.com](https://git-scm.com/downloads)

## 🚀 Pași de Instalare

### Pasul 1: Clonează Proiectul
```bash
git clone https://github.com/eddy-24/curier-app.git
cd curier-app
```

### Pasul 2: Configurează Baza de Date

**Windows (PowerShell):**
```powershell
# Intră în PostgreSQL
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# În consola PostgreSQL, creează baza de date:
CREATE DATABASE curier_app;
\q
```

**Linux/Mac:**
```bash
# Intră în PostgreSQL
psql -U postgres

# În consola PostgreSQL:
CREATE DATABASE curier_app;
\q
```

### Pasul 3: Configurează Backend-ul

**Editează credențialele PostgreSQL** (dacă e necesar):

Deschide `src/main/resources/application.properties` și modifică:
```properties
spring.datasource.username=postgres
spring.datasource.password=PAROLA_TA_AICI
```

### Pasul 4: Instalează Dependințele Frontend

```bash
cd curier-app-frontend
npm install
cd ..
```

## ▶️ Rulare Aplicație

### Varianta 1: Manual (2 terminale)

**Terminal 1 - Backend:**
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Așteaptă să vezi: `Started CurierAppApplication in X seconds`

**Terminal 2 - Frontend:**
```bash
cd curier-app-frontend
npm run dev
```

Aplicația va fi disponibilă la: **http://localhost:5174**

### Varianta 2: Script Automat

**Windows - `start-app.ps1`:**
```powershell
# Pornește backend
Write-Host "🚀 Pornesc backend-ul..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\mvnw.cmd spring-boot:run"

# Așteaptă 30 secunde pentru backend
Write-Host "⏳ Aștept pornirea backend-ului (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Pornește frontend
Write-Host "🎨 Pornesc frontend-ul..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\curier-app-frontend'; npm run dev"

Write-Host "✅ Aplicația pornește!" -ForegroundColor Green
Write-Host "📱 Acesează: http://localhost:5174" -ForegroundColor Cyan
```

**Linux/Mac - `start-app.sh`:**
```bash
#!/bin/bash

echo "🚀 Pornesc backend-ul..."
gnome-terminal -- bash -c "cd $(pwd) && ./mvnw spring-boot:run; exec bash" &

echo "⏳ Aștept pornirea backend-ului (30s)..."
sleep 30

echo "🎨 Pornesc frontend-ul..."
gnome-terminal -- bash -c "cd $(pwd)/curier-app-frontend && npm run dev; exec bash" &

echo "✅ Aplicația pornește!"
echo "📱 Acesează: http://localhost:5174"
```

Rulează scriptul:
```bash
# Windows
.\start-app.ps1

# Linux/Mac
chmod +x start-app.sh
./start-app.sh
```

## 👤 Conturi Demo

După pornire, aplicația va avea automat utilizatori de test:

| Username | Parolă | Rol |
|----------|--------|-----|
| client1 | pass123 | Client |
| client2 | pass123 | Client |
| curier1 | pass123 | Curier |
| curier2 | pass123 | Curier |
| sofer1 | pass123 | Șofer |
| admin | admin123 | Administrator |

## 🔧 Troubleshooting

### Eroare: "Port already in use"
```bash
# Windows - oprește procesul pe portul 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Eroare: "Cannot connect to database"
- Verifică că PostgreSQL rulează
- Verifică username/password în `application.properties`
- Verifică că baza de date `curier_app` există

### Frontend nu se conectează la backend
- Verifică că backend-ul rulează pe port 8080
- Verifică console-ul browserului pentru erori CORS
- Verifică că fișierul `CorsConfig.java` există

### Maven wrapper nu funcționează
```bash
# Descarcă wrapper-ul
mvn wrapper:wrapper

# SAU folosește Maven instalat global
mvn spring-boot:run
```

## 📦 Build pentru Producție

### Backend (JAR):
```bash
.\mvnw.cmd clean package
# Fișierul va fi în: target/curier-app-0.0.1-SNAPSHOT.jar

# Rulează:
java -jar target/curier-app-0.0.1-SNAPSHOT.jar
```

### Frontend (Static):
```bash
cd curier-app-frontend
npm run build
# Fișierele vor fi în: dist/
```

## 🌐 Deploy pe Server

### Backend:
1. Copiază fișierul JAR pe server
2. Instalează Java 21
3. Configurează PostgreSQL
4. Rulează: `java -jar curier-app.jar`

### Frontend:
1. Build-uiește: `npm run build`
2. Copiază folder-ul `dist/` pe server
3. Servește cu Nginx/Apache/Caddy

**Exemplu Nginx:**
```nginx
server {
    listen 80;
    server_name curier-app.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

## 📞 Suport

Pentru probleme, verifică:
- Backend logs: în terminal-ul unde rulează Spring Boot
- Frontend logs: Console-ul browserului (F12)
- Database logs: PostgreSQL logs

---

**Versiuni:**
- Java: 21.0.9
- Spring Boot: 3.5.7
- PostgreSQL: 18.1
- React: 19.2.0
- Node.js: 18+
