# RT Resto

A modern, full-stack Restaurant Management System built as a monorepo using [Turborepo](https://turbo.build/). This system consists of a customer-facing client application, an administration dashboard, and a backend service.

## Project Structure

This project is organized as a monorepo with the following structure:

- **`apps/client`**: The customer-facing web application for browsing menus and placing orders.
- **`apps/admin`**: The administration dashboard for restaurant managers to manage menus, orders, and settings.
- **`apps/backend`**: The backend API service built with Express, providing data to both frontend applications.
- **`packages/*`**: Shared libraries and configurations used across the applications (UI components, TypeScript config, ESLint config, etc.).


## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [Docker](https://www.docker.com/) (required for the database)

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd rt-resto
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Start the infrastructure:**

    This project uses PostgreSQL for the database. Start the required services using Docker:

    ```bash
    docker-compose up -d
    ```

4.  **Environment Setup:**

    Copy the example environment files to create your local configurations:

    ```bash
    # Root
    cp .env.example .env

    # Apps
    cp apps/client/.env.example apps/client/.env
    cp apps/admin/.env.example apps/admin/.env
    cp apps/backend/.env.example apps/backend/.env
    ```

    Ensure the database connection string in `apps/backend/.env` matches your Docker configuration (default is provided in `.env.example`).

5.  **Database Migration:**

    Run the database migrations to set up the schema:

    ```bash
    pnpm db:migrate
    ```

    _(Note: This runs the `db:migrate` script from `apps/backend`)_

6.  **Start the development server:**

    Start all applications simultaneously:

    ```bash
    pnpm dev
    ```

    - **Client App**: [http://localhost:3000](http://localhost:3000)
    - **Admin App**: [http://localhost:3001](http://localhost:3001)
    - **Backend API**: [http://localhost:3002](http://localhost:3002)

## Commands

- `pnpm dev`: Start the development server for all apps.
- `pnpm build`: Build all apps and packages.
- `pnpm lint`: Lint all codebases.
- `pnpm format`: Format code with Prettier.

For app-specific commands, you can filter by workspace:

```bash
pnpm --filter client dev
pnpm --filter admin build
```
## ER diagram
 <img width="2308" height="2637" alt="image" src="https://github.com/user-attachments/assets/360abcce-86f6-4a01-8f1d-6999d9746d77" />
