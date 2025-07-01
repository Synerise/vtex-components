import React, { useContext } from 'react'
import { FormattedNumber } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import type { ProductDataType } from '../../types/ProductTypes'
import styles from './SearchResults.css'
import { SearchContext } from '../Search'

interface SearchProductProps {
  product: ProductDataType
  position: number
}

export function SearchProduct({ product, position }: SearchProductProps) {
  const { correlationId } = useContext(SearchContext)
  const { culture } = useRuntime()
  const price = product.price?.value ?? product.price
  const salePrice = product.salePrice?.value ?? product.salePrice
  const isSale = price !== salePrice

  const clickHandler = () => {
    if (typeof SR === 'undefined' || !correlationId) return

    SR.event.itemSearchClick({
      correlationId,
      item: product.itemId,
      position,
      searchType: 'autocomplete',
    })
  }

  const url = new URL(product.link)
  const path = url.pathname + url.search

  return (
    <li className={styles['product-list-item']}>
      <a
        href={path}
        onClick={clickHandler}
        className={styles['product-container']}
      >
        <img
          className={styles['product-img']}
          src={product.imageLink}
          alt={product.title}
        />
        <div className={styles['product-text']}>
          <div className={styles['product-title']}>{product.title}</div>
          <div className={styles['product-price-box']}>
            {isSale && (
              <span className={styles['product-prev-price']}>
                <FormattedNumber
                  value={price}
                  style="currency"
                  currency={culture.currency}
                />
              </span>
            )}
            <span className={styles['product-price']}>
              <FormattedNumber
                value={salePrice}
                style="currency"
                currency={culture.currency}
              />
            </span>
          </div>
        </div>
      </a>
    </li>
  )
}
