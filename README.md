#  Project Management System API

A robust, RESTful API built with Node.js, Express, and TypeScript, designed to manage projects, tasks, and team members with strict Role-Based Access Control (RBAC).

## ✨ Key Features

- **Authentication & Security:** JWT-based authentication, password hashing with Bcrypt, and Rate Limiting to prevent brute-force attacks.
- **Role-Based Access Control (RBAC):** Strict enforcement of `OWNER` and `MEMBER` roles. Owners can manage projects and members; Members can only update tasks assigned to them.
- **Input Validation:** Comprehensive request validation using Zod to ensure data integrity.
- **API Documentation:** Fully documented interactive API using Swagger/OpenAPI.
- **Unit Testing:** Isolated unit tests for the business logic layer using Mocha, Chai, and Sinon.
- **Pagination & Filtering:** Secure, optimized pagination for large datasets.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via MongoDB Atlas)
- **ORM:** Prisma
- **Validation:** Zod
- **Documentation:** Swagger UI
- **Testing:** Mocha, Chai, Sinon

## ️ Architecture

This project follows a strict **Layered Architecture** to ensure separation of concerns and scalability:

1. **Controllers:** Handle HTTP requests, extract data, and send responses.
2. **Services:** Contain the core business logic, RBAC checks, and data transformation (DTOs).
3. **Repositories:** Handle all database communication using Prisma.
4. **Middlewares:** Handle cross-cutting concerns like Authentication, Validation, and Error Handling.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A MongoDB database (Local or MongoDB Atlas)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```
        git clone https://github.com/seifeldin1/Project-Managment-System
        cd Project-Management-System
   ```

2. **Install dependencies:**
    ```
        npm install
    ```

3. **Configure Environment Variables:**
    ```
        PORT=3000
        NODE_ENV=development
        DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/team_project?retryWrites=true&w=majority"
        JWT_SECRET="your_super_secret_jwt_key_here"
    ```

4. **Sync Database Schema:**
Since we are using MongoDB, we use `db push` to sync the schema:
    ```
       npx prisma db push
    ```

5. **Seed the Database (Optional):**
Populate the database with mock users, projects, and tasks:
    ```
        npm run prisma:seed
    ```

## 🚀 Running the Project
- Development Mode:
    ```
        npm run dev
    ```
- Production Build:
    ```
        npm run build
        npm start
    ```

## 📚 API Documentation
Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api-docs`
You can test endpoints directly from the browser. Use the "Authorize" button to input your JWT token for protected routes.

## 🧪 Testing
The project includes unit tests for the Service layer to ensure business logic and Role Base Access Control rules are correctly enforced without hitting the actual database.
    ```
        npm run test
    ```

🔒 Security & Advanced Requirements
- RBAC (Role-Based Access Control): Implemented in the Service layer. For example, a `MEMBER` cannot delete a project or update a task they are not assigned to.
- Rate Limiting: The `/auth/login` endpoint is protected by `express-rate-limit` (5 attempts per 15 minutes) to prevent brute-force attacks.
- Input Sanitization: Zod validators prevent malformed data from reaching the database. Pagination limits are clamped to prevent Denial of Service (DoS) via massive queries.
- HTTP Security Headers: `Helmet.js` is used to set secure HTTP headers automatically.
- Global Error Handling: A centralized error handler catches operational and unexpected errors, returning clean JSON responses without leaking stack traces in production.

## 👤 Author
Seif Dakroury, 
Cairo University Racing Team (CURT)

