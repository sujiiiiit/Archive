// the two macOS cursors the site draws: the arrow, and the pointing hand over anything clickable.
// The art in /public/cursor is named <cursor>-1__<x>-<y>.svg, where x and y are the hotspot as a
// percentage of the 768 x 746 canvas. Each is a 768px PNG wrapped in an SVG, far more than a cursor
// needs, so they load from png/: the same art baked flat at 320px wide, still sharp on a 3x screen.

type Art = {
  src: string
  w: number
  h: number
  // the click point, in canvas px
  hot: { x: number; y: number }
  // each turns toward the way it moves, around `pivot` (the middle of its solid shape),
  // pointing along `heading` at rest
  pivot: { x: number; y: number }
  heading: number
}

const CANVAS = { w: 767.314286, h: 746 }

function art(file: string, middle: { dx: number; dy: number }): Art {
  const [, x, y] = file.match(/__(\d+)-(\d+)$/)!.map(Number)
  const hot = { x: (x / 100) * CANVAS.w, y: (y / 100) * CANVAS.h }
  const pivot = { x: hot.x + middle.dx, y: hot.y + middle.dy }
  const heading = Math.atan2(hot.y - pivot.y, hot.x - pivot.x)
  return { src: `/cursor/png/${file}.png`, ...CANVAS, hot, pivot, heading }
}

// measured on each shape: how far below and right of the tip its middle sits
const cursors = {
  default: art("pointer-1__34-24", { dx: 122, dy: 193 }),
  pointer: art("pointinghand-1__39-26", { dx: 81, dy: 170 }),
}

type Cursor = keyof typeof cursors

// once the system cursor is hidden the browser no longer says which one it would show,
// so it's read back from the markup: the hand for anything you can click, the arrow for the rest
const CLICKABLE =
  'a[href], button, [role="button"], [role="link"], [role="tab"], [role="switch"], [role="checkbox"], [role="menuitem"], [role="option"], label[for], summary, select, input[type="checkbox"], input[type="radio"], input[type="range"], input[type="button"], input[type="submit"], input[type="image"]'

function cursorFor(start: Element): Cursor {
  for (let el: Element | null = start; el; el = el.parentElement) {
    // an explicit choice wins: cursor-pointer or data-cursor="pointer" for the hand, any other for the arrow
    const chosen =
      el.getAttribute("data-cursor") ||
      (el as HTMLElement).style?.cursor ||
      [...el.classList].find((c) => c.startsWith("cursor-"))?.slice(7)
    if (chosen && chosen !== "auto") {
      return chosen === "pointer" ? "pointer" : "default"
    }

    if (el.matches(CLICKABLE)) {
      return (el as HTMLButtonElement).disabled ||
        el.getAttribute("aria-disabled") === "true"
        ? "default"
        : "pointer"
    }
  }
  return "default"
}

export { cursorFor, cursors, type Art, type Cursor }
