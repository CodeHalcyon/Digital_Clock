import { useEffect, useState } from 'react'

export type Theme = {
  background: string
  foreground: string
  accent: string
}

export const DEFAULT_THEME: Theme = {
  background: '#0c0c0f',
  foreground: '#ececf0',
  accent: '#e3b76b',
}

export const PRESETS: { name: string; theme: Theme }[] = [
  { name: 'Default', theme: DEFAULT_THEME },
  { name: 'Mono', theme: { background: '#050505', foreground: '#f5f5f5', accent: '#f5f5f5' } },
  { name: 'Paper', theme: { background: '#f4f4f1', foreground: '#17171a', accent: '#b45309' } },
  { name: 'Moss', theme: { background: '#0a0f0c', foreground: '#e6efe9', accent: '#7fd3a0' } },
]

const STORAGE_KEY = 'focus-desk-theme'

function clampHex(hex: string) {
  const h = hex.trim().replace('#', '')
  if (h.length === 3) return h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return DEFAULT_THEME.background.replace('#', '')
  return h
}

function rgba(hex: string, alpha: number) {
  const h = clampHex(hex)
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function luminance(hex: string) {
  const h = clampHex(hex)
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p && typeof p.background === 'string') {
        return {
          background: p.background,
          foreground: p.foreground ?? DEFAULT_THEME.foreground,
          accent: p.accent ?? DEFAULT_THEME.accent,
        }
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  useEffect(() => {
    const root = document.documentElement.style
    const fg = theme.foreground

    root.setProperty('--background', theme.background)
    root.setProperty('--foreground', fg)
    root.setProperty('--accent', theme.accent)
    root.setProperty(
      '--accent-foreground',
      luminance(theme.accent) > 0.55 ? '#111114' : '#ffffff',
    )
    root.setProperty('--accent-dim', rgba(theme.accent, 0.12))

    /* Everything else derives from text + background so light themes work too */
    root.setProperty('--surface', rgba(fg, 0.05))
    root.setProperty('--surface-hover', rgba(fg, 0.09))
    root.setProperty('--border', rgba(fg, 0.12))
    root.setProperty('--border-strong', rgba(fg, 0.3))
    root.setProperty('--muted', rgba(fg, 0.55))
    root.setProperty('--faint', rgba(fg, 0.35))
    root.setProperty('--ring', rgba(fg, 0.5))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  }, [theme])

  return {
    theme,
    setTheme,
    resetTheme: () => setTheme(DEFAULT_THEME),
  }
}