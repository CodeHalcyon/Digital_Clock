import { AnimatePresence, motion } from 'framer-motion'
import { Minimize, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

type Phase = 'focus' | 'break'

const DEFAULT_DURATION: Record<Phase, number> = {
  focus: 25 * 60,
  break: 5 * 60,
}

const STORAGE_KEY = 'focus-desk-pomodoro'

type Persisted = {
  phase: Phase
  remaining: number
  running: boolean
  completed: number
}

function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p && typeof p.remaining === 'number') return { ...p }
    }
  } catch {
    /* ignore */
  }
  return {
    phase: 'focus',
    remaining: DEFAULT_DURATION.focus,
    running: false,
    completed: 0,
  }
}

const RADIUS = 52
const CIRC = 2 * Math.PI * RADIUS

function beep() {
  try {
    const Ctx = window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    /* audio unavailable */
  }
}

function draw(r: number) {
  return String(r).padStart(2, '0')
}

function Ring({
  size,
  phase,
  remaining,
  total,
  minutes,
  seconds,
}: {
  size: 'panel' | 'focus'
  phase: Phase
  remaining: number
  total: number
  minutes: number
  seconds: number
}) {
  const progress = total > 0 ? 1 - remaining / total : 1
  const isFocus = phase === 'focus'
  const big = size === 'focus'
  const accent = isFocus ? 'var(--accent)' : 'var(--success)'

  return (
    <div className="relative grid place-items-center">
      <motion.svg
        viewBox="0 0 120 120"
        role="img"
        aria-label={`${isFocus ? 'Focus' : 'Break'} session, ${minutes}:${draw(seconds)} remaining`}
        className={cn(
          big ? 'h-[min(64vmin,560px)] w-[min(64vmin,560px)]' : 'h-[190px] w-[190px]',
        )}
      >
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={big ? 1.5 : 3}
        />
        <motion.circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={accent}
          strokeWidth={big ? 1.5 : 3}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: CIRC * progress }}
          transition={{ duration: 1, ease: 'linear' }}
          transform="rotate(-90 60 60)"
        />
      </motion.svg>

      <div className="absolute flex flex-col items-center gap-3">
        <span
          className={cn(
            'flex items-center gap-2 uppercase tracking-[0.35em]',
            big ? 'gap-3 text-sm' : 'text-[10px]',
            isFocus ? 'text-accent' : 'text-success',
          )}
        >
          <span className={cn('bg-current', big ? 'size-1.5' : 'size-1')} aria-hidden="true" />
          {isFocus ? 'Focus' : 'Break'}
        </span>
        <span
          className={cn(
            'font-mono font-light leading-none tabular-nums text-foreground',
            big ? 'text-[clamp(3.5rem,16vw,9rem)]' : 'text-[2.25rem]',
          )}
        >
          {minutes}:{draw(seconds)}
        </span>
      </div>
    </div>
  )
}

export function Pomodoro({ className }: { className?: string }) {
  const [state, setState] = useState<Persisted>(loadPersisted)
  const [focused, setFocused] = useState(false)
  const reduced = usePrefersReducedMotion()

  const phase = state.phase
  const total = DEFAULT_DURATION[phase]
  const remaining = Math.min(state.remaining, total)
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!state.running) return
    const id = setInterval(() => {
      setState((prev) => {
        const nextRemaining = prev.remaining - 1
        if (nextRemaining <= 0) {
          if (prev.phase === 'focus') beep()
          const nextPhase: Phase = prev.phase === 'focus' ? 'break' : 'focus'
          return {
            phase: nextPhase,
            remaining: DEFAULT_DURATION[nextPhase],
            running: true,
            completed: prev.phase === 'focus' ? prev.completed + 1 : prev.completed,
          }
        }
        return { ...prev, remaining: nextRemaining }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [state.running])

  useEffect(() => {
    if (!focused) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocused(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused])

  const toggleRun = () => {
    const willRun = !state.running
    if (willRun) setFocused(true)
    setState((prev) => ({ ...prev, running: !prev.running }))
  }

  const reset = () => {
    setFocused(false)
    setState((prev) => ({
      ...prev,
      phase: 'focus',
      remaining: DEFAULT_DURATION.focus,
      running: false,
    }))
  }

  const skip = () => {
    beep()
    setState((prev) => {
      const nextPhase: Phase = prev.phase === 'focus' ? 'break' : 'focus'
      return {
        ...prev,
        phase: nextPhase,
        remaining: DEFAULT_DURATION[nextPhase],
        running: false,
        completed: prev.phase === 'focus' ? prev.completed + 1 : prev.completed,
      }
    })
  }

  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 240, damping: 30 }

  return (
    <>
      <section
        className={cn('flex h-full flex-col', className)}
        aria-label="Pomodoro timer"
      >
        <header className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-muted">
            Pomodoro
          </h2>
          <span className="font-mono text-xs tabular-nums text-faint">
            {state.completed} complete
          </span>
        </header>

        <Ring
          size="panel"
          phase={phase}
          remaining={remaining}
          total={total}
          minutes={minutes}
          seconds={seconds}
        />

        <div className="mx-auto mt-3 w-full max-w-[220px]">
          <Button
            variant="default"
            size="default"
            onClick={toggleRun}
            className="h-10 w-full"
          >
            {state.running ? (
              <>
                <Pause className="size-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="size-3.5" /> {remaining < total ? 'Resume' : 'Start'}
              </>
            )}
          </Button>

          <div className="mt-2 grid grid-cols-2 gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="h-8 justify-center"
            >
              <RotateCcw className="size-3" /> Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={skip}
              className="h-8 justify-center"
            >
              Skip
            </Button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {focused && (
          <motion.div
            key="pomodoro-focus"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={spring}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-hidden bg-background"
            role="dialog"
            aria-label="Pomodoro focus mode"
          >
            <button
              onClick={() => setFocused(false)}
              aria-label="Exit fullscreen timer"
              title="Exit fullscreen (Esc)"
              className="absolute right-5 top-5 grid size-10 cursor-pointer place-items-center text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Minimize className="size-4" />
            </button>

            <Ring
              size="focus"
              phase={phase}
              remaining={remaining}
              total={total}
              minutes={minutes}
              seconds={seconds}
            />

            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-faint">
                {state.completed} completed
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="default"
                  onClick={toggleRun}
                  className="h-12 px-8 text-base"
                >
                  {state.running ? (
                    <>
                      <Pause className="size-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="size-4" /> {remaining < total ? 'Resume' : 'Start'}
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={reset}
                  className="h-12 px-5 text-base"
                >
                  <RotateCcw className="size-4" /> Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}