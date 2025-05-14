import React, { useState } from 'react'
import type { ReactNode } from 'react'

import styles from './FiltersContainer.css'

interface FiltersContainerProps {
  children: ReactNode | ReactNode[]
}

export function FiltersContainer({ children }: FiltersContainerProps) {
  const [expanded, setExpanded] = useState(false)

  const handleOpenClick = () => {
    setExpanded(true)
  }

  const handleCloseClick = () => {
    setExpanded(false)
  }

  return (
    <aside>
      <button onClick={handleOpenClick} className={styles['filters-btn']}>
        <svg
          viewBox="0 0 24 24"
          className="filter-m"
          data-testid="ds-icon-filter-m"
          fill="currentColor"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M20.25 6H3.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5zM16.714 11.25h-9.43a.75.75 0 100 1.5h9.43a.75.75 0 000-1.5zM13.02 16.5h-2.199a.75.75 0 100 1.5h2.2a.75.75 0 100-1.5z" />
        </svg>
        <span>Filter</span>
      </button>
      <div
        className={`${styles['filters-container']} ${
          expanded ? styles['filters-container--open'] : ''
        }`}
      >
        <button onClick={handleCloseClick} className={styles['filters-btn']}>
          <svg
            viewBox="0 0 24 24"
            className="close-m"
            data-testid="ds-icon-close-m"
            fill="currentColor"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M13.06 12l4.72-4.72a.75.75 0 00-1.06-1.06L12 10.94 7.28 6.22a.75.75 0 00-1.06 1.06L10.94 12l-4.72 4.72a.75.75 0 101.06 1.06L12 13.06l4.72 4.72a.75.75 0 001.06-1.06z" />
          </svg>
        </button>
        {children}
      </div>
    </aside>
  )
}
