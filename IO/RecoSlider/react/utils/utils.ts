const DEVICE_BREAKPOINTS = {
  tablet: 900,
  phone: 600,
}

export const DEVICES = {
  tablet: 'tablet',
  desktop: 'desktop',
  phone: 'phone',
} as const

export type DevicesType = keyof typeof DEVICES

export const getDevice = (): DevicesType =>
  window?.matchMedia(`(max-width: ${DEVICE_BREAKPOINTS.phone}px)`).matches
    ? DEVICES.phone
    : window?.matchMedia(`(max-width: ${DEVICE_BREAKPOINTS.tablet}px)`).matches
    ? DEVICES.tablet
    : DEVICES.desktop
