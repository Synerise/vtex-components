import type { ProductType } from '../types/product'
import styles from './ProductStyles.css'

// {
//   brand,
//   category,
//   imageLink,
//   itemId,
//   title,
//   price: { value: price },
//   salePrice: { value: salePrice },
//   link,
// }

export function Product({
  imageLink,
  title,
  link,
  price: { value: price },
}: ProductType) {
  return (
    <a
      className={styles.product}
      href={link.replace('synerisepartnerar', 'trainingbk--synerisepartnerar')}
    >
      <img src={imageLink} />
      <div>{title}</div>
      <div className={styles.price}>
        {(+price).toFixed(2).replace('.', ',')} zł
      </div>
    </a>
  )
}
