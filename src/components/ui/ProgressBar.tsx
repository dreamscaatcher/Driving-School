import { useEffect, useRef } from 'react'

interface Props {
  value: number
  max: number
  className?: string
}

/** Renders a filled bar. Width is set imperatively to avoid inline-style lint warnings. */
export default function ProgressBar({ value, max, className = 'bg-blue-500' }: Readonly<Props>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = max > 0 ? `${(value / max) * 100}%` : '0%'
    }
  }, [value, max])

  return (
    <div
      ref={ref}
      className={`h-full rounded-full transition-all duration-500 ${className}`}
    />
  )
}
