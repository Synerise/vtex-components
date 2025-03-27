import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedNumber } from 'react-intl'

import styles from './SliderItem.css'

interface PriceProps {
  price: number
  salePrice: number
}

export function Price({ price, salePrice }: PriceProps) {
  const { culture } = useRuntime()
  const isSale = price !== salePrice
  const { currency } = culture

  return (
    <div className={styles['price-container']}>
      {isSale && (
        <div className={styles['prev-price']}>
          <FormattedNumber value={price} style="currency" currency={currency} />
        </div>
      )}
      <div className={styles.price}>
        <FormattedNumber
          value={isSale ? salePrice : price}
          style="currency"
          currency={currency}
        />
      </div>
    </div>
  )
}
