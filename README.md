# XP-Engineer-API

A robust and modular backend API built with Fastify, TypeScript, and PostgreSQL. This API serves as the backend for a learning platform, featuring modules for users, lessons, achievements, and user progress tracking.

## 🚀 Tech Stack

- **Framework:** [Fastify](https://fastify.dev/) (with `@fastify/cors`, `@fastify/jwt`, `@fastify/swagger`)
- **Language:** TypeScript
- **Database:** PostgreSQL (using `pg`)
- **Validation:** [Zod](https://zod.dev/) (via `fastify-type-provider-zod`)
- **API Documentation:** [Scalar](https://scalar.com/) & Swagger
- **Linting/Formatting:** [Biome](https://biomejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Git Hooks:** Husky & lint-staged

## 📦 Project Structure

The project follows a clean, modular architecture:

```
src/
├── lib/               # Shared libraries and database connection
├── modules/           # Feature-based modules (achievements, lessons, modules, user-modules, users)
│   └── [module_name]/ # Each module contains its controller, service, repository, and routes
├── types/             # TypeScript interfaces, types, and Zod schemas
├── utils/             # Helper functions and utilities
├── router.ts          # Central API route registration
└── server.ts          # Application entry point and server configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database

### Installation

1. Clone the repository and navigate into the directory.
2. Install the dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Ensure your PostgreSQL instance is running and update the `.env` variables if necessary:
```env
host='localhost'
port=5435
user='admin'
password='admin'
database='db'
```

### Running the Application

To start the development server with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3333`.

## 📚 API Documentation

Interactive API documentation is automatically generated and available via Scalar.

Once the server is running, you can access the documentation at:
**[http://localhost:3333/docs](http://localhost:3333/docs)**

## 📜 Available Scripts

- `npm run dev` - Starts the development server using `tsx`.
- `npm run build` - Compiles TypeScript to JavaScript and resolves aliases.
- `npm start` - Runs the compiled application from the `dist` folder.
- `npm run lint` - Runs Biome to check and fix formatting and linting errors.
- `npm test` - Runs the test suite using Vitest.
- `npm run prepare` - Sets up Husky git hooks.

## 📄 License

This project is licensed under the ISC License.