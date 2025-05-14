import React from 'react'

import { Select } from '../../UI'
import { SortOrdering } from './SortOrdering'
import styles from './Sort.css'

interface SortControlProps {
  sortBy: string
  setSortBy: (value: string) => void
  switchOrdering: () => void
  ordering: string
}

export function SortControl({
  sortBy,
  setSortBy,
  switchOrdering,
  ordering,
}: SortControlProps) {
  return (
    <div className={styles['sort-control']}>
      <Select
        id="sortBySelect"
        label="Sort by"
        selectHandler={setSortBy}
        value={sortBy}
        options={[
          { value: 'relevance', label: 'Relevance' },
          { value: 'title', label: 'Product name' },
          { value: 'salePrice.value', label: 'Price' },
        ]}
      />
      <SortOrdering ordering={ordering} switchOrdering={switchOrdering} />
    </div>
  )
}
