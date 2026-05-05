# XP-Engineer-API

A robust and modular backend API built with Fastify, TypeScript, and PostgreSQL. This API serves as the backend for a gamified learning platform, featuring modules for users, lessons, achievements, progress tracking, streaks, level progression, and exercise lists with PDF storage.

## 🚀 Tech Stack

- **Framework:** [Fastify](https://fastify.dev/) (with `@fastify/cors`, `@fastify/jwt`, `@fastify/swagger`)
- **Language:** TypeScript
- **Database:** PostgreSQL (using `pg`)
- **Storage:** [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible, for PDFs)
- **Validation:** [Zod](https://zod.dev/) (via `fastify-type-provider-zod`)
- **API Documentation:** [Scalar](https://scalar.com/) & Swagger
- **Linting/Formatting:** [Biome](https://biomejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Git Hooks:** Husky & lint-staged

## 📦 Project Structure

The project follows a clean, modular architecture:

```
src/
├── lib/               # Shared libraries (db, cloudinary, r2)
├── modules/           # Feature-based modules
│   ├── auth/          # Authentication (register, login, me)
│   ├── users/         # User CRUD
│   ├── modules/       # Learning modules
│   ├── lessons/       # Lesson content
│   ├── quizzes/       # Module quizzes
│   ├── progress/      # Progress tracking, XP, level up
│   ├── streak/        # Streak tracking (daily activity)
│   ├── achievements/  # User achievements
│   ├── user-modules/  # Module enrollment (with XP gating)
│   ├── exercise-lists/# Exercise lists with R2 PDF storage
│   └── upload/        # File uploads (Cloudinary)
├── types/             # TypeScript interfaces, types, and Zod schemas
├── utils/             # Helper functions and utilities
├── router.ts          # Central API route registration
└── server.ts          # Application entry point and server configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database
- Cloudflare R2 bucket (for PDF storage)

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

Fill in the required variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5435
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=db

# Auth
JWT_SECRET=your-secret-key

# Cloudinary (avatars/images)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Cloudflare R2 (PDF storage)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

### Cloudflare R2 Setup

1. Create a bucket in the [Cloudflare dashboard](https://dash.cloudflare.com/) under R2.
2. Go to R2 > Manage R2 API Tokens > Create API Token.
3. Select "Object Read & Write" permission for your bucket.
4. Copy the Access Key ID and Secret Access Key to your `.env`.
5. The Account ID is visible in the dashboard URL or R2 endpoint.

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

## 🎮 Gamification Features

- **XP System:** Users earn 100 XP per completed module (quiz score >= 80%).
- **Level Progression:** Progressive thresholds (200, 500, 1000, 1700, 2600, 3800, 5300, 7200, 9500 XP).
- **Module Gating:** Modules can require a minimum XP (`min_xp`) to unlock.
- **Streak Tracking:** Daily activity tracking with streak history. Completing a lesson or module counts as activity.
- **Achievements:** Unlockable badges and rewards.

## 📜 Available Scripts

- `npm run dev` - Starts the development server using `tsx`.
- `npm run build` - Compiles TypeScript to JavaScript and resolves aliases.
- `npm start` - Runs the compiled application from the `dist` folder.
- `npm run lint` - Runs Biome to check and fix formatting and linting errors.
- `npm test` - Runs the test suite using Vitest.
- `npm run prepare` - Sets up Husky git hooks.

## 📄 License

This project is licensed under the ISC License.