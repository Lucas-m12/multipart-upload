# Lambdas

AWS Lambda functions for this project. Deployment is **manual** (upload a `.zip` in the AWS
console) — there is no SAM/CDK/Serverless framework here.

## Convention

Each function is a **self-contained folder**: `lambdas/<name>/`.

- It holds its own handler code and its own runtime manifest — `package.json` for Node,
  `requirements.txt` for Python, a compiled binary for Go, etc. Runtimes can differ per folder;
  they don't have to match the frontend.
- These folders are intentionally **not** part of the pnpm workspace, so a Node function keeps its
  dependencies inside its own folder (which is what makes the `.zip` self-contained).
- Each folder has a short `README.md` documenting: runtime, handler entrypoint, environment
  variables, and any deploy notes.

## Adding a function

1. Create `lambdas/<name>/` with your handler + manifest + a `README.md`.
2. For a Node function, vendor production dependencies inside the folder before packaging:
   ```bash
   cd lambdas/<name> && npm install --omit=dev
   ```
   (For Python: `pip install -r requirements.txt -t .`)
3. Package it into an upload-ready archive from the repo root:
   ```bash
   pnpm package:lambda <name>
   ```
   This writes `dist/lambdas/<name>.zip` with the handler at the archive root.
4. Upload that `.zip` in the AWS console (Lambda → your function → Code → Upload from → .zip file).
