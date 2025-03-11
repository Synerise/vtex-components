import useProduct from 'vtex.product-context/useProduct'
import { useQuery } from 'react-apollo'

import { getSimilarQuery } from '../graphql/Queries'
import { Product } from './Product'
import type { ProductType } from '../types/product'
import styles from './ProductStyles.css'

const ProductReco: StorefrontFunctionComponent = () => {
  const { product } = useProduct()
  const { data } = useQuery(getSimilarQuery, {
    variables: { itemId: product?.productId, itemCatalogName: 'synerisevtex' },
    ssr: false,
    skip: !product,
  })

  return (
    <div className={styles['products-container']}>
      {data?.getSimilar.map((prodData: ProductType) => (
        <Product {...prodData} />
      ))}
    </div>
  )
}

export default ProductReco
