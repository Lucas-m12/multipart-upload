# multipart-upload

A file-upload web app plus its AWS Lambda backend, in one pnpm monorepo.

The frontend (UI, dropzone, upload list, progress) was scaffolded from the `presigned-url-upload`
project. The **multipart upload** flow and its Lambdas are to be implemented.

## Layout

```
.
├── apps/
│   └── web/            # React 19 + TypeScript + Vite frontend
├── lambdas/            # one self-contained folder per function (add your own)
└── scripts/
    └── package-lambda.sh   # zips a lambda folder for manual console upload
```

- `apps/*` (and `packages/*`) are pnpm workspace members. `lambdas/*` are **not** — each Lambda is a
  self-contained folder so its `.zip` is upload-complete. See `lambdas/README.md`.

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

Deployment is manual (upload a `.zip` in the AWS console). To package a function once you've added
one under `lambdas/<name>/`:

```bash
# Node example: vendor prod deps first, then zip
cd lambdas/<name> && npm install --omit=dev && cd -
pnpm package:lambda <name>     # -> dist/lambdas/<name>.zip
```

See `lambdas/README.md` for the folder convention and how to add a new function.
