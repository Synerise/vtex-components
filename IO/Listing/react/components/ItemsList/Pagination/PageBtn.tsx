import React from 'react'

import styles from './Pagination.css'

interface PageBtnProps {
  onPageChange: (page: number) => void
  page: number
  isActive?: boolean
}

export function PageBtn({ onPageChange, page, isActive }: PageBtnProps) {
  const handleClick = () => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`${styles['pagination-btn']} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
    >
      {page}
    </button>
  )
}
