import React, { useContext } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import styles from './SearchBarStyles.css'
import searchStyles from '../SearchStyles.css'
import { SearchContext } from '../Search'

interface SearchBarProps {
  setFocused: (focused: boolean) => void
  loading: boolean
}

export const SearchBar = function SearchBar({
  setFocused,
  loading,
}: SearchBarProps) {
  const { query, setQuery } = useContext(SearchContext)
  const { navigate } = useRuntime()

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim().length) return

    navigate({ to: `/search/?q=${query}` })
  }

  const inputFocusHandler = () => {
    setFocused(true)
  }

  return (
    <form onSubmit={searchHandler}>
      <input
        className={styles['search-input']}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.currentTarget.value)
        }
        type="text"
        value={query}
        placeholder="Search"
        onFocus={inputFocusHandler}
      />

      <button className={styles['search-btn']} type="submit">
        {loading ? (
          <div className={searchStyles['loading-spinner']} />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="search-m"
            data-testid="ds-icon-search-m"
            fill="currentColor"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M10.734 17.234a6.463 6.463 0 004.03-1.41l3.721 3.722a.75.75 0 001.06-1.06l-3.72-3.722a6.494 6.494 0 10-5.09 2.47zm0-11.5a5 5 0 11-5 5 5.006 5.006 0 015-5z" />
          </svg>
        )}
      </button>
    </form>
  )
}
