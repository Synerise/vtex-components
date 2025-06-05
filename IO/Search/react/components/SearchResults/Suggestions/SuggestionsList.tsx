import React, { useContext } from 'react'
import type { MouseEvent } from 'react'

import styles from './Suggestions.css'
import { SearchContext } from '../../Search'

interface SuggestionsListProps {
  items: Array<{ suggestion: string }>
  heading: string
  variant?: 'list' | 'wrap'
}

export function SuggestionsList({
  items,
  heading,
  variant = 'list',
}: SuggestionsListProps) {
  const { setQuery } = useContext(SearchContext)

  const clickSuggestionHandler = (e: MouseEvent<HTMLButtonElement>) => {
    setQuery(e.currentTarget.value)
  }

  return (
    <div className={styles['suggestions-container']}>
      <h3 className={styles['suggestions-heading']}>{heading}</h3>
      <ul
        className={`${styles['suggestions-list']} ${
          variant === 'wrap' ? styles['suggestions-list--wrap'] : ''
        }`}
      >
        {items.map((item, i) => (
          <li
            className={styles['suggestions-item']}
            key={`${i}-${item.suggestion}`}
          >
            <button
              className={styles['suggestions-btn']}
              value={item.suggestion}
              onClick={clickSuggestionHandler}
            >
              {item.suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
