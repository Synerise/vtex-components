import React, { useMemo } from 'react'

import { PageBtn } from './PageBtn'
import styles from './Pagination.css'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  const middlePages = useMemo(() => {
    const half = Math.floor(maxVisible / 2)
    let start = page - half
    let end = page + half

    if (start < 1) {
      end += 1 - start
      start = 1
    }

    if (end > totalPages) {
      start = Math.max(start + totalPages - end, 1)
      end = totalPages
    }

    const pages = []

    for (let i = start; i <= end; i++) pages.push(i)

    return pages
  }, [page, totalPages, maxVisible])

  return (
    <div className={styles['pagination-container']}>
      {middlePages[0] > 1 && <PageBtn onPageChange={onPageChange} page={1} />}
      {middlePages[0] > 2 && <span>...</span>}
      {middlePages.map((p) => (
        <PageBtn
          key={`${p}${Math.random()}`}
          onPageChange={onPageChange}
          page={p}
          isActive={p === page}
        />
      ))}
      {middlePages[middlePages.length - 1] < totalPages - 1 && <span>...</span>}
      {middlePages[middlePages.length - 1] < totalPages && (
        <PageBtn onPageChange={onPageChange} page={totalPages} />
      )}
    </div>
  )
}
