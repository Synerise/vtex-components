import React from 'react'

import type { ProductDataType } from '../../types/ProductTypes'
import { SearchProduct } from './SearchProduct'
import styles from './SearchResults.css'

interface SearchResultsListProps {
  products: ProductDataType[]
  heading?: string
}

export function SearchResultsList({
  products,
  heading = 'Search results',
}: SearchResultsListProps) {
  if (!products.length) {
    return null
  }

  return (
    <div className={styles['search-results-list-container']}>
      <h3 className={styles['search-heading']}>{heading}</h3>
      <ul className={styles['search-results-list']}>
        {products.map((product, i) => (
          <SearchProduct
            key={product.itemId}
            position={i + 1}
            product={product}
          />
        ))}
      </ul>
    </div>
  )
}
