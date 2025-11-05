import { normalizeBase, setOverride } from "./core"

export type ImportMetaEnvLike = Record<string, unknown> | undefined | null

const DEFAULT_KEYS = [
  "KAZVIZIAN_BASE_URL",
  "VITE_BASE_URL",
  "NEXT_PUBLIC_BASE_URL",
  "BASE_URL"
]

export const setBaseUrlFromImportMetaEnv = (
  env: ImportMetaEnvLike,
  options?: { name?: string; keys?: string[] }
) => {
  if (!env || typeof env !== "object") return
  const name = options?.name ?? "default"
  const keys =
    options?.keys && options.keys.length ? options.keys : DEFAULT_KEYS
  for (const k of keys) {
    const val = env[k as keyof typeof env]
    if (typeof val === "string" && val) {
      setOverride(name, normalizeBase(val))
      return
    }
  }
}
