# Admin App (Dashboard)

This is the administration dashboard for the **RT Resto** Restaurant Management System. It enables restaurant managers to control the system, including managing menus, viewing orders, and configuring settings.

**Note:** This application is part of the `rt-resto` monorepo.

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **State Management**: Zustand, TanStack Query
- **Authentication**: Better Auth
- **Real-time**: Socket.io Client

## Prerequisites

Ensure the following are running before starting the admin app:

- **Backend Service**: The backend API must be running on port 3002.
- **Database**: Postgres must be running (via Docker).

## Getting Started

1.  **Environment Setup:**

    Ensure you have created the `.env` file from `.env.example`:

    ```bash
    cp .env.example .env
    ```

2.  **Run the Application:**

    You can run this app individually using the workspace filter from the root directory:

    ```bash
    pnpm --filter admin dev
    ```

    Or, if you are inside the `apps/admin` directory:

    ```bash
    pnpm dev
    ```

    The app will be available at [http://localhost:3001](http://localhost:3001).

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint.
- `pnpm typecheck`: Runs TypeScript type checking.
