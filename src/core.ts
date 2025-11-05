import type { BaseUrlMap } from "./types"

// In-memory overrides for the global API
let overrides: BaseUrlMap = {}

export const normalizeBase = (url: string): string => {
  if (!url) return ""
  // Keep protocol intact (https://, file:, etc.), just trim trailing slashes
  // but preserve protocol double slash when base is exactly scheme://
  // e.g., "https://" should remain "https://" and not "https:/"
  const m = url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/$/)
  if (m) return url
  return url.replace(/\/+$/g, "")
}

const safeAccess = <T>(fn: () => T): T | undefined => {
  try {
    return fn()
  } catch {
    return undefined
  }
}

export const envGet = (name: string): string | undefined => {
  // Node.js
  const node = safeAccess(() => (globalThis as any).process?.env?.[name])
  if (typeof node === "string" && node) return node
  // Bun
  const bun = safeAccess(() => (globalThis as any).Bun?.env?.[name])
  if (typeof bun === "string" && bun) return bun
  // Deno (requires permission; if not granted, will throw and be caught)
  const deno = safeAccess(() => (globalThis as any).Deno?.env?.get?.(name))
  if (typeof deno === "string" && deno) return deno
  return undefined
}

const sanitizeServiceName = (name: string): string =>
  name
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()

export const toEnvKey = (name: string): string =>
  `${sanitizeServiceName(name)}_BASE_URL`

export const readFromGlobals = (key: string): string | undefined => {
  const map = (globalThis as any).__KAZVIZIAN_BASE_URLS__ as
    | BaseUrlMap
    | undefined
  if (map && typeof map[key] === "string" && map[key]) return map[key]
  return undefined
}

export const setOverride = (key: string, value?: string) => {
  if (!value) {
    delete overrides[key]
  } else {
    overrides[key] = normalizeBase(value)
  }
}

export const getOverride = (key: string): string | undefined => overrides[key]

export const resolveBaseUrl = (options: {
  name?: string // undefined or "default"
  preferred?: string
}): string => {
  const name = options.name ?? "default"
  const preferred = options.preferred

  // 1. preferred
  if (preferred && typeof preferred === "string")
    return normalizeBase(preferred)

  // 2. in-memory override
  const o = getOverride(name)
  if (o) return o

  // 3. global map
  const fromGlobal = readFromGlobals(name)
  if (fromGlobal) return normalizeBase(fromGlobal)

  // 4. env vars
  const keys: string[] = []
  if (name !== "default") keys.push(toEnvKey(name))
  keys.push("KAZVIZIAN_BASE_URL", "BASE_URL")
  for (const k of keys) {
    const v = envGet(k)
    if (v) return normalizeBase(v)
  }

  // 5. no adapter in core

  // 6. fallback
  return ""
}

export const buildUrl = (base: string, ...parts: string[]): string => {
  const b = normalizeBase(base)
  const cleanedParts = parts
    .filter((p) => p != null && p !== "")
    .map((p) => String(p))
    .map((p) => p.replace(/^\/+|\/+$/g, ""))
    .filter((p) => p.length > 0)

  if (!b) return cleanedParts.join("/")

  // Handle protocol separators correctly
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/$/.test(b)) {
    return b + cleanedParts.join("/")
  }
  return [b, ...cleanedParts].join("/")
}

export const createBaseUrlManager = (initial?: BaseUrlMap) => {
  let local: BaseUrlMap = {}
  if (initial) {
    for (const [k, v] of Object.entries(initial)) local[k] = normalizeBase(v)
  }

  const get = (preferred?: string) => {
    if (preferred) return normalizeBase(preferred)
    if (local["default"]) return local["default"]
    return resolveBaseUrl({ name: "default" })
  }

  const set = (url?: string) => {
    if (!url) delete local["default"]
    else local["default"] = normalizeBase(url)
  }

  const getFor = (name: string, preferred?: string) => {
    if (preferred) return normalizeBase(preferred)
    if (local[name]) return local[name]
    return resolveBaseUrl({ name })
  }

  const setFor = (name: string, url?: string) => {
    if (!url) delete local[name]
    else local[name] = normalizeBase(url)
  }

  return {
    getBaseUrl: get,
    setBaseUrl: set,
    getBaseUrlFor: getFor,
    setBaseUrlFor: setFor
  } as const
}
