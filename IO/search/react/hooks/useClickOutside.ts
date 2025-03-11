import { useEffect, useRef } from 'react'

export function useClickOutside(action: () => void) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClick: EventListener = e => {
      const target = e.target as Node

      if (ref.current?.contains(target)) return

      action()
    }

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [ref])

  return ref
}
