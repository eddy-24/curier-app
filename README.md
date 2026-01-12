# 🚚 Curier App

Aplicație de management pentru servicii de curierat - backend Spring Boot + frontend React/TypeScript.

## 📋 Cerințe

- **Java 21** (Eclipse Adoptium / Temurin recomandat)
- **Node.js 18+** și npm
- **PostgreSQL 15+**
- **Maven 3.8+**

## 🗄️ Setup Baza de Date

### 1. Creează baza de date PostgreSQL

```sql
CREATE DATABASE curier_app_new;
```

### 2. Configurează conexiunea

Editează `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/curier_app_new
spring.datasource.username=postgres
spring.datasource.password=PAROLA_TA
```

### 3. Populează baza de date (opțional)

După ce pornești aplicația prima dată (tabelele se creează automat), poți popula cu date de test:

```bash
psql -U postgres -d curier_app_new -f populate_final.sql
```

Sau din pgAdmin: deschide `populate_final.sql` și execută.

**Date incluse:**
- 26 utilizatori (1 admin, 3 operatori, 7 curieri, 15 clienți)
- 40 adrese
- 25 comenzi
- 28 colete
- 45 tracking events
- 25 facturi
- 20 rute curieri

## 🚀 Pornire Aplicație

### Backend (Spring Boot)

```bash
# Din directorul principal
./mvnw spring-boot:run
```

Sau pe Windows:
```powershell
.\mvnw.cmd spring-boot:run
```

Backend-ul pornește pe **http://localhost:8081**

### Frontend (React + Vite)

```bash
cd curier-app-frontend
npm install
npm run dev
```

Frontend-ul pornește pe **http://localhost:5173**

## 🔐 Conturi de Test

După popularea bazei de date, poți folosi:

| Username | Parolă | Rol |
|----------|--------|-----|
| admin | admin123 | Administrator |
| maria.operator | operator123 | Operator |
| dan.curier | curier123 | Curier |
| andreea.popescu | client123 | Client |

> **Notă:** La prima pornire după populare, Spring Boot va actualiza automat parolele cu hash-uri BCrypt corecte.

## 📁 Structură Proiect

```
curier-app/
├── src/                          # Backend Spring Boot
│   └── main/
│       ├── java/com/curier_app/  # Cod Java
│       └── resources/            # Configurări
├── curier-app-frontend/          # Frontend React
│   ├── src/
│   │   ├── components/           # Componente reutilizabile
│   │   └── pages/                # Pagini per rol
│   │       ├── admin/            # Dashboard admin
│   │       ├── client/           # Portal client
│   │       ├── curier/           # App curier
│   │       └── operator/         # Panel operator
│   └── package.json
├── populate_final.sql            # Script populare DB
└── pom.xml                       # Configurare Maven
```

## 🎯 Roluri și Funcționalități

### 👤 Client
- Creare expedieri noi
- Tracking colete
- Vizualizare facturi
- Gestionare adrese

### 🚚 Curier
- Vizualizare livrări zilnice
- Scanare AWB
- Update status colete
- Încasare ramburs

### 📋 Operator
- Gestionare colete și comenzi
- Asignare curieri
- Monitorizare fluxuri

### ⚙️ Administrator
- Dashboard statistici
- CRUD utilizatori
- Configurări servicii
- Rapoarte KPI

## 🛠️ Dezvoltare

### Build producție

```bash
# Backend
./mvnw clean package -DskipTests

# Frontend
cd curier-app-frontend
npm run build
```

### Rulare teste

```bash
./mvnw test
```

## 📝 Licență