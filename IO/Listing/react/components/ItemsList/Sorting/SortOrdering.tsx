import React from 'react'

import styles from './Sort.css'

export const SORTING_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type OrderingType =
  (typeof SORTING_OPTIONS)[keyof typeof SORTING_OPTIONS]

interface SortOrderingProps {
  ordering: string
  switchOrdering: () => void
}

export function SortOrdering({ ordering, switchOrdering }: SortOrderingProps) {
  return (
    <button className={styles['sort-order']} onClick={switchOrdering}>
      {ordering === SORTING_OPTIONS.ASC ? (
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          className="sort-ascending-m"
          data-testid="ds-icon-sort-ascending-m"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M13.036 12.75H4.75a.75.75 0 010-1.5h8.286a.75.75 0 010 1.5zM6.821 7.544H4.75a.75.75 0 010-1.5h2.071a.75.75 0 010 1.5zM19.25 18H4.75a.75.75 0 010-1.5h14.5a.75.75 0 010 1.5z" />
        </svg>
      ) : (
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          className="sort-descending-m"
          data-testid="ds-icon-sort-descending-m"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M6.821 18H4.75a.75.75 0 010-1.5h2.071a.75.75 0 110 1.5zM19.25 7.545H4.75a.75.75 0 010-1.5h14.5a.75.75 0 010 1.5zM13.036 12.75H4.75a.75.75 0 010-1.5h8.286a.75.75 0 010 1.5z" />
        </svg>
      )}
    </button>
  )
}
