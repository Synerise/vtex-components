import React from 'react'

import { Select } from '../../UI'
import { SortOrdering } from './SortOrdering'
import styles from './Sort.css'
import { useListingContext } from '../../../context'

export function SortControl() {
  const { sortBy, setSortByHandler, ordering, switchOrderingHandler } =
    useListingContext()

  return (
    <div className={styles['sort-control']}>
      <Select
        id="sortBySelect"
        label="Sort by"
        selectHandler={setSortByHandler}
        value={sortBy}
        options={[
          { value: 'relevance', label: 'Relevance' },
          { value: 'title', label: 'Product name' },
          { value: 'salePrice.value', label: 'Price' },
        ]}
      />
      <SortOrdering
        ordering={ordering}
        switchOrdering={switchOrderingHandler}
      />
    </div>
  )
}
