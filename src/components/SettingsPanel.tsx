import { X } from 'lucide-react'
import * as React from 'react'

import { PRESETS, type Theme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

const FIELDS: { key: keyof Theme; label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'foreground', label: 'Text' },
  { key: 'accent', label: 'Accent' },
]

export function SettingsPanel({
  theme,
  setTheme,
  resetTheme,
  onClose,
  className,
}: {
  theme: Theme
  setTheme: (t: Theme) => void
  resetTheme: () => void
  onClose: () => void
  className?: string
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-label="Appearance settings"
      className={cn('w-[264px] border border-border bg-background p-4', className)}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted">
          Appearance
        </h3>
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="cursor-pointer text-faint transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => setTheme(p.theme)}
            title={p.name}
            aria-label={`Apply ${p.name} theme`}
            className={cn(
              'relative h-8 flex-1 cursor-pointer border transition-all focus-visible:ring-1 focus-visible:ring-ring',
              theme.background === p.theme.background &&
                theme.accent === p.theme.accent
                ? 'border-foreground'
                : 'border-border hover:border-border-strong',
            )}
            style={{ background: p.theme.background }}
          >
            <span
              className="absolute left-2 top-1/2 h-0.5 w-3 -translate-y-1/2"
              style={{ background: p.theme.foreground }}
            />
            <span
              className="absolute right-2 top-1/2 size-2 -translate-y-1/2"
              style={{ background: p.theme.accent }}
            />
          </button>
        ))}
      </div>

      <div className="border-t border-border">
        {FIELDS.map((field) => (
          <label
            key={field.key}
            className="flex items-center justify-between border-b border-border py-2 text-xs text-muted"
          >
            {field.label}
            <input
              type="color"
              value={theme[field.key]}
              onChange={(e) =>
                setTheme({ ...theme, [field.key]: e.target.value })
              }
              aria-label={`${field.label} color`}
              className="size-6"
            />
          </label>
        ))}
      </div>

      <button
        onClick={resetTheme}
        className="mt-3 cursor-pointer font-mono text-[10px] uppercase tracking-[0.25em] text-faint transition-colors hover:text-foreground"
      >
        Reset
      </button>
    </div>
  )
}