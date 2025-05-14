import React from 'react'

import { Select } from '../UI'
import { SortControl } from './Sorting'
import styles from './ItemsList.css'

interface ItemsListTopBarProps {
  ordering: string
  switchOrdering: () => void
  sortBy: string
  setSortBy: (sortBy: string) => void
  pageSize: string
  setPageSize: (pageSize: string) => void
}

export function ItemsListTopBar({
  ordering,
  switchOrdering,
  sortBy,
  setSortBy,
  pageSize,
  setPageSize,
}: ItemsListTopBarProps) {
  return (
    <div className={styles['listing-top-bar']}>
      <SortControl
        ordering={ordering}
        switchOrdering={switchOrdering}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Select
        id="itemsPerPageSelect"
        label="Items per page"
        selectHandler={setPageSize}
        options={[{ value: '12' }, { value: '24' }, { value: '48' }]}
        value={pageSize}
      />
    </div>
  )
}
