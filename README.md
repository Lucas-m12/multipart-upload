# multipart-upload

A file-upload web app plus its AWS Lambda backend, in one pnpm monorepo.

The frontend (UI, dropzone, upload list, progress) was scaffolded from the `presigned-url-upload`
project. The **multipart upload** flow and its Lambdas are to be implemented.

## Layout

```
.
├── apps/
│   └── web/            # React 19 + TypeScript + Vite frontend
├── lambdas/            # Serverless Framework service: multipart-upload backend
└── scripts/
    └── package-lambda.sh   # legacy manual-zip helper (superseded by serverless deploy)
```

- `apps/*`, `packages/*`, and `lambdas` are pnpm workspace members. See `lambdas/README.md` for the
  backend.

## Frontend

```bash
pnpm install          # install workspace deps (run once, at the repo root)
pnpm dev              # start the Vite dev server
pnpm build            # type-check + build to apps/web/dist
pnpm lint             # oxlint
pnpm preview          # preview the production build
```

Configure the backend endpoint via `apps/web/.env` (copy from `apps/web/.env.example`):

```
VITE_PRESIGN_URL=https://<your-lambda-url>/
```

`.env` is gitignored; the current uploader requires `VITE_PRESIGN_URL` (uploads throw a clear error
if it's unset).

## Lambdas

The backend is a single [Serverless Framework](https://www.serverless.com/) v4 service under
`lambdas/` that provisions the multipart-upload Lambdas, the HTTP API, the S3 bucket, CORS, and IAM.
TypeScript handlers are bundled with esbuild on deploy — no manual zipping.

```bash
cd lambdas
serverless login          # v4 requires auth (or set SERVERLESS_ACCESS_KEY)
pnpm deploy               # serverless deploy (needs AWS credentials + a region)
```

Or from the repo root: `pnpm deploy:backend`. Deploy prints the API base URL to set as
`VITE_PRESIGN_URL`. See `lambdas/README.md` for the endpoint contract and how to add a function.
