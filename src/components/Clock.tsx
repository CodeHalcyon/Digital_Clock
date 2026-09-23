import { useEffect, useState } from 'react'

import { FlipClock } from '@/components/FlipClock'
import { cn } from '@/lib/utils'

function greeting(hour: number) {
  if (hour < 5) return 'Night'
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  if (hour < 21) return 'Evening'
  return 'Night'
}

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function Clock({ className }: { className?: string }) {
  const now = useNow(500)
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  const dateLine = `${now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase()}, ${now
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()}`

  return (
    <section
      className={cn(
        'flex select-none flex-col items-center gap-5 sm:gap-6',
        className,
      )}
      aria-label="Current time"
    >
      <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.4em] text-muted">
        <span className="size-1 bg-accent" aria-hidden="true" />
        {greeting(now.getHours())}
      </p>

      <FlipClock hours={hh} minutes={mm} seconds={ss} />

      <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-muted">
        {dateLine}
      </span>
    </section>
  )
}