# Laravel Cloud deployment

The current Cloud policy is a monorepo deployment from the repository root.
This branch's package-boundary changes are not claimed to be live. No database,
cache, AI credentials, or other application secrets are needed for the
visual-only Playground.

## Current monorepo mode

- **Repository root:** the monorepo root, so pnpm workspaces and the built
  component package remain available.
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

The start script sets `NODE_ENV=production`. The server uses the `PORT`
supplied by Cloud, with a local default of `3000`, and leaves the listen host
unset so Node accepts IPv6 and IPv4 connections where dual-stack is available.
Cloud's startup probes connect over IPv6; do not bind to IPv4-only `0.0.0.0`.
Configure startup, readiness, and liveness checks to use `/health`.

In this mode the Playground keeps its `workspace:*` dependency on
`remix-ai-elements`. pnpm's `injectWorkspacePackages: true` and
`dependenciesMeta.injected: true` place an installed copy in the virtual store.
`dedupeInjectedDeps: false` keeps the Playground copy distinct, while
`syncInjectedDepsAfterScripts: [build]` refreshes it after the package build.
The Remix asset server therefore resolves the installed public package; it
does not need a repository-relative `dist` or `dist/internal` mount.

The workspace sets `virtualStoreDir: node_modules/pnpm-store` so generated
package asset URLs do not contain a hidden `.pnpm` path segment. Cloud's Nginx
blocks dot-directory paths before they reach Remix. Keep this storage layout
instead of disabling Cloud's hidden-file protection; Remix's package allowlist
and private-module rejection remain unchanged. A clean frozen install applies
the layout without changing package versions.

The asset pipeline is on demand rather than a Vite static distribution.
`examples/playground/remix.json` allows the app's public modules, the shared
visual fixture, and the `remix` and `remix-ai-elements` packages. Keep that
allowlist explicit.

## Future immutable release mode

Release mode is a deliberate future change, not the current dependency or
Cloud configuration:

1. Produce a real immutable GitHub Release tarball.
2. Validate that exact tarball before changing the Playground dependency:
   `pnpm test:consumer /path/to/immutable-release-tarball.tgz`, or pass the
   real HTTPS release URL when one exists. The consumer script retains its
   isolated copy and checks public exports, declarations, SSR, and the
   Playground asset graph.
3. In a separate reviewed change, replace the Playground `workspace:*`
   dependency with that real tarball reference, regenerate and commit
   `pnpm-lock.yaml`, and remove the workspace-only injected metadata.

A future release-mode Cloud deployment can build the Playground from the
tarball recorded in its lockfile with:

```sh
npm install -g pnpm@11.21.0 && pnpm install --frozen-lockfile && pnpm --filter playground build
```

Use the same start command:

```sh
pnpm start
```

This build installs dependencies and builds only the Playground; it does not
build the local component package. The start command and asset mounts do not
otherwise change. A locally packed tarball is useful boundary coverage but is
not evidence that a hosted release exists; this repository has not published an
npm package or created a GitHub Release.

## Official documentation

- [Laravel Cloud deployments](https://laravel.com/cloud/docs/deployments)
- [Using Yarn, Bun, or pnpm](https://laravel.com/cloud/docs/knowledge-base/using-yarn-bun-pnpm)
