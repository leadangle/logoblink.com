// import React from 'react'
import screens from 'styles/tailwind-screens'
import { pick, transform, capitalize } from 'lodash'
import { createMatchMediaConnect } from 'react-matchmedia-connect'

export default function createResponsiveConnect(breakpoints, opts) {
  const breakpointsList = []
  const queryMap = {
    isLandscape: '(orientation: landscape)',
    isPortrait: '(orientation: portrait)',
  }

  for (const key in breakpoints) {
    if (!breakpoints.hasOwnProperty(key)) continue
    const value = breakpoints[key]
    breakpointsList.push({ key, value })
  }

  // Make sure breakpoints are ordered by value ASC
  breakpointsList.sort(({ value: a }, { value: b }) => a - b)

  breakpointsList.forEach((breakpoint, idx) => {
    const { key } = breakpoint
    const capitalizedKey = capitalize(key)
    // Skip min-width query for first element
    if (idx > 0) {
      const { value: width } = breakpoint
      const minWidthKey = `isMin${capitalizedKey}`
      queryMap[minWidthKey] = `(min-width: ${width}px)`
    }
    const nextBreakpoint = breakpointsList[idx + 1]
    // Skip max-width query for last element
    if (nextBreakpoint) {
      const { value: nextWidth } = nextBreakpoint
      const maxWidthKey = `isMax${capitalizedKey}`
      queryMap[maxWidthKey] = `(max-width: ${nextWidth - 1}px)`
    }
  })

  return createMatchMediaConnect(queryMap, opts)
}

export function domReady(callback) {
  // bail if SSR
  if (typeof document === 'undefined') {
    return
  }

  // in case the document is already rendered
  if (document.readyState != 'loading') callback()
  // modern browsers
  else if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', callback)
  // IE <= 8
  else
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState == 'complete') callback()
    })
}

let matchMediaFn = typeof window !== 'undefined' ? window.matchMedia : null

domReady(() => {
  if (!matchMediaFn) {
    matchMediaFn = window.matchMedia
  }
})

const responsiveConnectConfig = transform(
  pick(screens, ['sm', 'md', 'lg', 'xl']),
  (res, value, key) => {
    res[key] = parseInt(value, 10)
  },
  {}
)

export const withBreakpoints = options =>
  createResponsiveConnect(responsiveConnectConfig, options)()

export const enhanceWithBreakpoints = withBreakpoints({ matchMediaFn })
