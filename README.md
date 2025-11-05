<div align="center">

# Docklet – Cross-Runtime Base URL Utilities

[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Deno](https://img.shields.io/badge/Deno-%23000000.svg?style=for-the-badge&logo=deno&logoColor=white)](https://deno.land/)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)<br />
[![semantic-release](https://img.shields.io/badge/semantic--release-%23007eff.svg?logo=semantic-release&logoColor=white)](https://semantic-release.gitbook.io/)
![Conventional Commits](https://img.shields.io/badge/commit-conventional-blue.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

</div>

**Docklet** is a tiny, zero-dependency TypeScript library for resolving and building base URLs across runtimes — Browser, Node, Bun, and Deno.
It’s framework-agnostic, deterministic, and supports optional adapters for `import.meta.env`.

## Installation

```bash
# Using Bun
bun add docklet

# Using npm
npm i docklet
```

## Quick Start

```ts
import { getBaseUrl, buildUrl } from "docklet"

// KAZVIZIAN_BASE_URL=https://api.example.com
const url = buildUrl(getBaseUrl(), "v1", "users")
```

## API Overview

- `setBaseUrl(url?)` / `getBaseUrl(preferred?)`
- `setBaseUrlFor(name, url?)` / `getBaseUrlFor(name, preferred?)`
- `buildUrl(base, ...parts)`
- `createBaseUrlManager(initial?)`
- `setBaseUrlFromImportMetaEnv(env, options?)`

## Resolution Order

1. Preferred argument
2. In-memory override
3. `globalThis.KAZVIZIAN_BASE_URLS`
4. Environment variables (`NAME_BASE_URL`, `KAZVIZIAN_BASE_URL`, `BASE_URL`)
5. Adapter (`import.meta.env`)
6. Fallback: empty string

## Examples

**Vite**

```ts
import { setBaseUrlFromImportMetaEnv } from "docklet"
setBaseUrlFromImportMetaEnv(import.meta.env)
```

**Multiple Services**

```ts
import { setBaseUrlFor, getBaseUrlFor, buildUrl } from "docklet"

setBaseUrlFor("content", "https://content.example.com")
const url = buildUrl(getBaseUrlFor("content"), "assets", "logo.png")
```

## CI/CD

Automated versioning and publishing are handled via GitHub Actions:

- **Automatic release** on push/merge to `main` using `semantic-release`
- **Manual release** via workflow dispatch (`release-manual.yml`) with dry-run and dist-tag options

### Prerequisites

- Repository secrets: `NPM_TOKEN` (automation token) and `GITHUB_TOKEN`
- Use [Conventional Commits](https://www.conventionalcommits.org) for semantic versioning

## Local Development

```bash
bun run build
bun test
bun x semantic-release --dry-run
```

## License

MIT © KazViz
