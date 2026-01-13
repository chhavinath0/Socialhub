# Socialhub - Full Stack Application

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Spring Boot
- **Database:** PostgreSQL
- **IDE:** IntelliJ IDEA

## Project Structure
```
Socialhub/
├── backend/      # Spring Boot REST API
├── frontend/     # React application
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or 21
- Node.js 18+
- PostgreSQL
- IntelliJ IDEA

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on: http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE socialhub_db;
```

## Development Workflow
1. Start PostgreSQL
2. Run Backend (Spring Boot)
3. Run Frontend (React)
4. Access application at http://localhost:5173