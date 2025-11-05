export type ServiceName = string
export type BaseUrlMap = Record<ServiceName, string>

declare global {
  // Optional global hook that host apps can populate
  // eslint-disable-next-line no-var
  var __KAZVIZIAN_BASE_URLS__: BaseUrlMap | undefined
}

export {}
