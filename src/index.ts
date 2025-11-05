import type { BaseUrlMap, ServiceName } from "./types"
import {
  buildUrl,
  createBaseUrlManager,
  getOverride,
  normalizeBase,
  resolveBaseUrl,
  setOverride
} from "./core"
export type { BaseUrlMap, ServiceName } from "./types"
export { buildUrl, createBaseUrlManager }
export { setBaseUrlFromImportMetaEnv } from "./adapters"

export const setBaseUrl = (url?: string): void => setOverride("default", url)

export const getBaseUrl = (preferred?: string): string =>
  resolveBaseUrl({ preferred, name: "default" })

export const setBaseUrlFor = (name: ServiceName, url?: string): void =>
  setOverride(name, url)

export const getBaseUrlFor = (name: ServiceName, preferred?: string): string =>
  resolveBaseUrl({ name, preferred })

// For advanced users: access to normalized override (read-only)
export const __debug_getOverride = (name: ServiceName = "default") =>
  getOverride(name)
