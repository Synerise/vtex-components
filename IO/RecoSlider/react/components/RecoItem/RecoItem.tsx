import React from 'react'

import styles from './SliderItem.css'
import type { ProductData } from '../../types/recommendationTypes'
import { Price } from './Price'
import { Image } from './Image'

interface RecoItemProps {
  productData: ProductData
}

export function RecoItem({ productData }: RecoItemProps) {
  const { title, price, salePrice, link, imageLink } = productData

  return (
    <a href={link} className={styles['slider-item']}>
      <Image imageLink={imageLink} title={title} />
      <div className={styles.title}>{title}</div>
      <Price price={price.value} salePrice={salePrice.value} />
    </a>
  )
}
