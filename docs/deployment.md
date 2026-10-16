# Laravel Cloud deployment

The Remix playground can run as a generic Node.js application from the repository root. This is a deployment recipe only; the app has not been deployed.

## Application settings

- **Repository root:** the monorepo root, so workspace dependencies and the built component package remain available.
- **Application type:** generic Node.js application.
- **Node.js:** 24.3.0 or later.
- **Build command:**

  ```sh
  npm install -g pnpm@11.21.0 && pnpm install --frozen-lockfile && pnpm build:playground
  ```

- **Start command:**

  ```sh
  pnpm start
  ```

The start script sets `NODE_ENV=production`. The server listens on `0.0.0.0` using the `PORT` supplied by Cloud, with a local default of `3000`. Configure the health check to use `/health`.

The Remix asset server compiles and serves browser assets on demand; deployment does not rely on Vite's static output. Browser access is restricted to the configured Remix and `remix-ai-elements` packages, app public files, and the shared visual fixture.

No database, cache, AI credentials, or other application secrets are required. The playground displays fixed visual examples only.

## Official documentation

- [Laravel Cloud deployments](https://laravel.com/cloud/docs/deployments)
- [Using Yarn, Bun, or pnpm](https://laravel.com/cloud/knowledge-base/using-yarn-bun-pnpm)
