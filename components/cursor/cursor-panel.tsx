"use client"

import { useState } from "react"

import {
  cursorDefaults,
  resetCursorSettings,
  setCursorSettings,
  useCursorSettings,
} from "@/components/cursor/cursor-settings"

// a dev-only panel for tuning the cursor by feel; "copy" puts the values on the clipboard to make them the defaults
function CursorPanel() {
  const s = useCursorSettings()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(s, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-50 rounded-full border bg-card px-3 py-1.5 font-sans text-xs text-muted-foreground shadow-sm hover:text-foreground"
      >
        Cursor
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Cursor settings"
      className="fixed right-4 bottom-4 z-50 max-h-[calc(100svh-2rem)] w-72 overflow-y-auto rounded-xl border bg-card p-4 font-sans text-xs shadow-lg"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-sm font-medium">
          Cursor <span className="font-normal text-muted-foreground">· experimental</span>
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        <Slider
          label="Size"
          value={s.size}
          min={14}
          max={40}
          step={1}
          shown={`${s.size}px`}
          onChange={(size) => setCursorSettings({ size })}
        />
        <Slider
          label="Smoothness"
          value={s.smoothing}
          min={0}
          max={0.25}
          step={0.005}
          shown={s.smoothing ? `${Math.round(s.smoothing * 1000)}ms` : "off"}
          onChange={(smoothing) => setCursorSettings({ smoothing })}
        />
        <label className="flex items-center justify-between">
          <span>Tilt while moving</span>
          <input
            type="checkbox"
            checked={s.tilt}
            onChange={(e) => setCursorSettings({ tilt: e.target.checked })}
            className="size-3.5 accent-foreground"
          />
        </label>
        <Slider
          label="Tilt amount"
          value={s.tiltMax}
          min={0}
          max={30}
          step={1}
          shown={`${s.tiltMax}°`}
          disabled={!s.tilt}
          onChange={(tiltMax) => setCursorSettings({ tiltMax })}
        />
        <Slider
          label="Click press"
          value={s.clickScale}
          min={0.6}
          max={1}
          step={0.01}
          shown={`${Math.round(s.clickScale * 100)}%`}
          onChange={(clickScale) => setCursorSettings({ clickScale })}
        />
      </div>

      <div className="mt-5 flex justify-between border-t pt-3 text-muted-foreground">
        <button
          type="button"
          onClick={resetCursorSettings}
          disabled={JSON.stringify(s) === JSON.stringify(cursorDefaults)}
          className="hover:text-foreground disabled:opacity-40"
        >
          Reset
        </button>
        <button type="button" onClick={copy} className="hover:text-foreground">
          {copied ? "Copied" : "Copy values"}
        </button>
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  shown,
  disabled,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  shown: string
  disabled?: boolean
  onChange: (value: number) => void
}) {
  return (
    <label className={`block ${disabled ? "opacity-40" : ""}`}>
      <span className="mb-1.5 flex justify-between">
        {label}
        <span className="text-muted-foreground tabular-nums">{shown}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-foreground"
      />
    </label>
  )
}

export { CursorPanel }
