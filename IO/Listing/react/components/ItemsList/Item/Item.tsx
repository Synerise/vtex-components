import React from 'react'

import type { ProductDataType } from '../../../types/ProductTypes'
import styles from '../ItemsList.css'
import { Image } from './Image'
import { Price } from './Price'

interface ItemProps {
  data: ProductDataType
  correlationId: string | undefined
  searchType: string
  position: number
}

export function Item({ data, correlationId, searchType, position }: ItemProps) {
  const { link, imageLink, title, price, salePrice, itemId } = data

  const path = new URL(link).pathname

  const clickHandler = () => {
    if (typeof SR === 'undefined') return

    SR.event.itemSearchClick({
      correlationId,
      item: itemId,
      position,
      searchType,
    })
  }

  return (
    <a href={path} className={styles.item} onClick={clickHandler}>
      <Image imageLink={imageLink} title={title} />
      <div className={styles.title}>{title}</div>
      <Price price={price.value} salePrice={salePrice.value} />
    </a>
  )
}
