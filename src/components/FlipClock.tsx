import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

/** Must match --flip-dur in index.css */
export const FLIP_DURATION = 500

function FlipDigit({ value }: { value: string }) {
  const [prev, setPrev] = useState(value)
  const [flipping, setFlipping] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (value === prev) {
      setFlipping(false)
      return
    }
    if (reduced) {
      setPrev(value)
      return
    }
    setFlipping(true)
    const t = window.setTimeout(() => {
      setPrev(value)
      setFlipping(false)
    }, FLIP_DURATION)
    return () => window.clearTimeout(t)
  }, [value, prev, reduced])

  return (
    <span className="flip-card">
      <span className="flip-half flip-half--top">
        <span>{value}</span>
      </span>
      <span className="flip-half flip-half--bottom">
        <span>{prev}</span>
      </span>
      {flipping && (
        <>
          <span className="flip-flap flip-flap--top">
            <span>{prev}</span>
          </span>
          <span className="flip-flap flip-flap--bottom">
            <span>{value}</span>
          </span>
        </>
      )}
    </span>
  )
}

function FlipPair({ value }: { value: string }) {
  return (
    <span className="flip-pair">
      <FlipDigit value={value[0] ?? '0'} />
      <FlipDigit value={value[1] ?? '0'} />
    </span>
  )
}

function Colon() {
  return (
    <span className="flip-colon" aria-hidden="true">
      <i />
      <i />
    </span>
  )
}

export function FlipClock({
  hours,
  minutes,
  seconds,
  className,
}: {
  hours: string
  minutes: string
  seconds: string
  className?: string
}) {
  return (
    <div
      className={cn('flip-clock', className)}
      role="timer"
      aria-label={`${hours}:${minutes}:${seconds}`}
    >
      <span className="flip-clock-visual" aria-hidden="true">
        <FlipPair value={hours} />
        <Colon />
        <FlipPair value={minutes} />
        <Colon />
        <FlipPair value={seconds} />
      </span>
    </div>
  )
}