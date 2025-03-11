import useProduct from 'vtex.product-context/useProduct'
import { useQuery } from 'react-apollo'

import { getSimilarQuery } from '../graphql/Queries'
import { Product } from './Product'
import type { ProductType } from '../types/product'
import styles from './ProductStyles.css'
import { useEffect, useState } from 'react'

declare var SyneriseTC: any;

type RecoProps = {
  header: string
  campaignId: string
}

const ProductReco: StorefrontFunctionComponent<RecoProps> = ({ header , campaignId = 'xlGhqYfetW2q' }) => {
  const [syneriseUuid, setSyneriseUuid] = useState('');
  useEffect(() => {
    if (SyneriseTC) {
      setSyneriseUuid(SyneriseTC.uuid)     
    }
  }, []);


  const { product } = useProduct()
  const { data } = useQuery(getSimilarQuery, {
    variables: { itemId: product?.productId, campaignId: campaignId, uuid: syneriseUuid },
    ssr: false,
    skip: !product,
  })

  return (
    <div>
      <h3>{header}</h3>
      <div className={styles['products-container']}>
        {data?.getSimilar.slice(0,5).map((prodData: ProductType) => (
          <Product {...prodData} />
        ))}
      </div>
    </div>
  )
}



export default ProductReco

ProductReco.schema = {
  title: 'reco-component',
  description: 'reco-component',
  type: 'object',
  properties: {
    header: {
      title: 'Header',
      type: 'string',

    },
    campaignId: {
      title: 'CampaignID',
      type: 'string'
    }
  }

}
