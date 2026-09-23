import { Eye, EyeOff, Expand, Palette, Shrink } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Clock } from '@/components/Clock'
import { Pomodoro } from '@/components/Pomodoro'
import { SettingsPanel } from '@/components/SettingsPanel'
import { TodoList } from '@/components/TodoList'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

function FullscreenToggle() {
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  return (
    <ControlIconButton
      onClick={toggle}
      aria-label={isFs ? 'Exit fullscreen' : 'Enter fullscreen'}
      title="Fullscreen"
    >
      {isFs ? <Shrink className="size-4" /> : <Expand className="size-4" />}
    </ControlIconButton>
  )
}

function ControlIconButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'grid size-9 cursor-pointer place-items-center text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    />
  )
}

export default function App() {
  const { theme, setTheme, resetTheme } = useTheme()
  const [displayOnly, setDisplayOnly] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 30%, var(--accent-dim), transparent 65%)',
        }}
      />

      <main className="relative z-10 flex grow flex-col items-center justify-center px-4 py-10">
        <motion.div
          className="flex flex-col items-center"
          layout
          animate={{ scale: displayOnly ? 1.15 : 1 }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  scale: { type: 'spring', stiffness: 180, damping: 26 },
                  layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                }
          }
        >
          <Clock />
        </motion.div>
      </main>

      <AnimatePresence>
        {!displayOnly && (
          <motion.div
            key="dashboard"
            className="relative z-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 220, damping: 28 }
            }
          >
            <div className="mx-auto h-px max-w-5xl bg-border" />

            <div className="mx-auto grid w-full max-w-5xl gap-x-16 gap-y-10 px-6 py-10 md:grid-cols-2 md:py-14">
              <Pomodoro />
              <TodoList />
            </div>

            <footer className="pb-8 text-center text-[10px] font-medium uppercase tracking-[0.4em] text-faint">
              Focus desk clock
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {settingsOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setSettingsOpen(false)} />
      )}

      <div className="absolute right-4 top-4 z-40 flex gap-1">
        <ControlIconButton
          onClick={() => setSettingsOpen((v) => !v)}
          aria-label="Customize colors"
          aria-expanded={settingsOpen}
          title="Customize colors"
        >
          <Palette className="size-4" />
        </ControlIconButton>
        <ControlIconButton
          onClick={() => setDisplayOnly((v) => !v)}
          aria-label={displayOnly ? 'Show controls' : 'Clock-only display mode'}
          title="Clock-only display"
        >
          {displayOnly ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </ControlIconButton>
        <FullscreenToggle />
      </div>

      {settingsOpen && (
        <SettingsPanel
          theme={theme}
          setTheme={setTheme}
          resetTheme={resetTheme}
          onClose={() => setSettingsOpen(false)}
          className="absolute right-4 top-16 z-40"
        />
      )}
    </div>
  )
}