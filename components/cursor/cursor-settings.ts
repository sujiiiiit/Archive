"use client"

import { useSyncExternalStore } from "react"

// the knobs the experimental panel turns; the cursor reads them every frame
type CursorSettings = {
  // height of the arrow's visible shape, in px
  size: number
  // how long the cursor takes to catch up with the hand, in seconds; 0 follows exactly
  smoothing: number
  tilt: boolean
  // the most it leans, in degrees, when moving fast sideways
  tiltMax: number
  // how far it presses down on click
  clickScale: number
}

// tuned by feel in the panel
const defaults: CursorSettings = {
  size: 30,
  smoothing: 0.05,
  tilt: true,
  tiltMax: 19,
  clickScale: 0.85,
}

const KEY = "cursor-settings"

let current = defaults
const listeners = new Set<() => void>()

// saved values only exist in this browser, and only while experimenting in dev
function load() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) current = { ...defaults, ...JSON.parse(saved) }
  } catch {}
  listeners.forEach((l) => l())
}

function setCursorSettings(next: Partial<CursorSettings>) {
  current = { ...current, ...next }
  try {
    localStorage.setItem(KEY, JSON.stringify(current))
  } catch {}
  listeners.forEach((l) => l())
}

function resetCursorSettings() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
  current = defaults
  listeners.forEach((l) => l())
}

function getCursorSettings() {
  return current
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function useCursorSettings() {
  return useSyncExternalStore(subscribe, getCursorSettings, () => defaults)
}

export {
  defaults as cursorDefaults,
  getCursorSettings,
  load as loadCursorSettings,
  resetCursorSettings,
  setCursorSettings,
  useCursorSettings,
  type CursorSettings,
}
