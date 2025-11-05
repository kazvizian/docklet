import { describe, it, expect, beforeEach } from "bun:test"
import {
  buildUrl,
  createBaseUrlManager,
  getBaseUrl,
  getBaseUrlFor,
  setBaseUrl,
  setBaseUrlFor
} from "../src/index"

declare global {
  // eslint-disable-next-line no-var
  var __KAZVIZIAN_BASE_URLS__: Record<string, string> | undefined
}

describe("docklet core", () => {
  beforeEach(() => {
    setBaseUrl(undefined)
    setBaseUrlFor("content", undefined)
    globalThis.__KAZVIZIAN_BASE_URLS__ = undefined
    delete (process as any).env.KAZVIZIAN_BASE_URL
    delete (process as any).env.BASE_URL
    delete (process as any).env.CONTENT_BASE_URL
  })

  it("returns empty when nothing set", () => {
    expect(getBaseUrl()).toBe("")
  })

  it("preferred takes precedence", () => {
    setBaseUrl("https://a.com")
    expect(getBaseUrl("https://b.com/")).toBe("https://b.com")
  })

  it("override is used when set", () => {
    setBaseUrl("https://a.com/")
    expect(getBaseUrl()).toBe("https://a.com")
  })

  it("reads from global map", () => {
    globalThis.__KAZVIZIAN_BASE_URLS__ = { default: "https://g.com/" }
    expect(getBaseUrl()).toBe("https://g.com")
  })

  it("reads from env vars in order", () => {
    process.env.KAZVIZIAN_BASE_URL = "https://env.com/"
    expect(getBaseUrl()).toBe("https://env.com")
  })

  it("named services env key mapping", () => {
    process.env.CONTENT_BASE_URL = "https://content.example.com/"
    expect(getBaseUrlFor("content")).toBe("https://content.example.com")
  })

  it("buildUrl normalizes slashes", () => {
    expect(buildUrl("https://a.com/", "/x/", "y")).toBe("https://a.com/x/y")
    expect(buildUrl("", "a", "/b/")).toBe("a/b")
    expect(buildUrl("https://", "a")).toBe("https://a")
  })

  it("instance manager isolation", () => {
    const mgr = createBaseUrlManager({ content: "https://c.com/" })
    expect(mgr.getBaseUrlFor("content")).toBe("https://c.com")
    setBaseUrlFor("content", "https://x.com/")
    // global change shouldn't affect instance
    expect(mgr.getBaseUrlFor("content")).toBe("https://c.com")
  })
})
