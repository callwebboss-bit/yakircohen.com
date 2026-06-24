<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project rules

Full stack, env, build, and deployment conventions: **`.cursor/rules/yakircohen-project.mdc`** (always applied in Cursor).

## Build load (important on Dropbox / multiple agents)

- **Do not** run `npm run build` from every agent in parallel -- it stacks CPU/RAM and fights over `.next/`.
- **Prefer** `npm run verify:quick` (unit tests + security smoke -- fast on Dropbox).
- **Lint + tests:** `npm run verify:ci` (CI / pre-push; slow locally on Dropbox).
- **One build at a time:** `npm run build` is mutex-locked; if blocked, wait or run `npm run build:stop`.
- **Full production check:** run `npm run verify:predeploy` (or `npm run build` alone) once manually -- not per-agent.
