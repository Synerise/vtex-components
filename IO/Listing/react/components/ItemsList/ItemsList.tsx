import React from 'react'

import styles from './ItemsList.css'
import type { ProductDataType } from '../../types/ProductTypes'
import { Item } from './Item'

interface ItemsListProps {
  items: ProductDataType[]
  correlationId: string | undefined
  searchType: string
}

export function ItemsList({
  items,
  correlationId,
  searchType,
}: ItemsListProps) {
  return (
    <div className={styles['items-container']}>
      {items.map((item, i) => (
        <Item
          key={item.itemId}
          data={item}
          position={i + 1}
          correlationId={correlationId}
          searchType={searchType}
        />
      ))}
    </div>
  )
}
