# Food Ordering App

A full-stack food ordering application built with [Next.js](https://nextjs.org), Prisma,PostgreSQL,and Cloudinary.

## Features

- Multi-language support
- Admin panel for managing menu items
- Product images via Cloudinary
- Cart and checkout flow
- Payment integration (Paymob)
- Google OAuth login

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/food-ordering-app.git
    cd food-ordering-app
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn
    ```

3. Set up environment variables:
    - Copy `.env.example` to `.env` and fill in your credentials (see `.env` for required keys).

4. Run database migrations:
    ```sh
    npx prisma migrate dev
    ```

5. Start the development server:
    ```sh
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app` – Next.js app routes and pages
- `src/components` – UI and menu components
- `src/hooks` – Custom React hooks
- `prisma/schema.prisma` – Database schema
- `public/images` – Static images

## Environment Variables

See [.env](.env) for required variables:
- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform.

## License

MIT