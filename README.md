# Focus Desk Clock

A focused productivity clock dashboard — one cohesive dark screen combining a
live clock, a todo list, and a Pomodoro timer. Designed to sit on a secondary
device on your desk (tablet / mini-panel / spare monitor) as a permanent,
aesthetic display.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** with a restrained minimal system: warm near-black base,
  hairline borders, white space over chrome, a single quiet sand accent
- **shadcn/ui** primitives (Button, Input, Checkbox)
- **framer-motion** for functional motion (task add/remove, timer ring)
- **Custom split-flap flip clock** (CSS 3D)
- **JetBrains Mono** digits · **Inter** UI

## Layout

- **Clock (hero)** — a split-flap **flip clock** (real 3D flap animations, all
  digits the same size): `HH:MM:SS` sized from the viewport so it fills the
  screen, with greeting + date lines. Scales smoothly via spring animation when
  toggling clock-only mode.
- **Pomodoro** — thin SVG progress ring (25 min focus / 5 min break), start/
  resume/pause/reset/skip, session counter, Web Audio beep on focus completion.
  **Starting it expands the timer to cover the entire screen** (spring scale-in,
  only the timer visible); Esc or the minimize button shrinks it back.
- **Today** — quiet todo list: add on Enter or `+`, toggle, delete on hover,
  empty state, clear all.

Everything persists to `localStorage` and survives refresh — including the
appearance theme.

## Customization (like the original)

The palette button opens an **Appearance** panel with the color pickers from the
original version:

- **Background**, **Text**, and **Accent** colors — applied live, persisted
- **4 presets**: Default, Mono, Paper (light), Moss

The top-right **eye** button toggles clock-only display mode; the **expand**
button enters true fullscreen. Point the whole screen at your desk.

## Running

```bash
npm install
npm run dev        # dev server (default http://localhost:5173)
npm run build      # production build to dist/
npm run preview    # serve the production build
```

To show it on another device on your network:

```bash
npm run dev -- --host
npm run preview -- --host
```

Then open `http://<your-machine-ip>:5173` on the target device. See
`vite.config.ts` to adjust the network port / host.

## Accessibility

- Visible keyboard focus states on all controls
- ARIA labels on icon-only buttons
- `prefers-reduced-motion` disables all animation

The previous single-file version is preserved under `legacy/`.