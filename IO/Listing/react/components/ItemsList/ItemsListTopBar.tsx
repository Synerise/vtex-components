import React from 'react'

import { SortControl } from './Sorting'
import styles from './ItemsList.css'
import { PageSize } from './PageSize'

export function ItemsListTopBar() {
  return (
    <div className={styles['listing-top-bar']}>
      <SortControl />
      <PageSize />
    </div>
  )
}
