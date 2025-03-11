import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

interface SearchBoxProps {
  searchRef: RefObject<HTMLInputElement | null>
  onSearch: () => void
}

type Timeout = ReturnType<typeof setTimeout>

export function SearchBox({ searchRef, onSearch }: SearchBoxProps) {
  const timeoutId = useRef<Timeout>(undefined)
  const debouncedSearch = () => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(onSearch, 350)
  }

  useEffect(() => () => clearTimeout(timeoutId.current))

  return (
    <input
      className="input-reset ba b--black-20 pa2 mb2 db w-100 mw5"
      type="text"
      placeholder="Synerise search"
      ref={searchRef}
      onInput={debouncedSearch}
    />
  )
}
