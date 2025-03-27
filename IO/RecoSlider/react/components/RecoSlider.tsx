import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'

import { Slider } from './Slider'
import { RecoItem } from './RecoItem'
import { getRecommendationsQuery } from '../graphql/Queries'
import commonStyles from './CommonStyles.css'
import type { DevicesType } from '../utils'
import { DEVICES, getDevice } from '../utils'
import type { ProductData } from '../types/recommendationTypes'

const DEFAULT_ITEMS = {
  desktop: 4,
  tablet: 3,
  phone: 1,
}

interface RecoSliderProps {
  items: { desktop: number; tablet: number; phone: number }
  campaignId: string
  itemsSource: string
  itemsExcluded: string[]
  additionalFilters: string
  filtersJoiner: string
  additionalElasticFilters: string
  elasticFiltersJoiner: string
  displayAttributes: string[]
  includeContextItems: boolean
}

export function RecoSlider({
  items = DEFAULT_ITEMS,
  campaignId,
  itemsSource,
  itemsExcluded,
  additionalFilters,
  filtersJoiner,
  additionalElasticFilters,
  elasticFiltersJoiner,
  displayAttributes,
  includeContextItems,
}: RecoSliderProps) {
  const productCtx = useProduct()
  const [device, setDevice] = useState<DevicesType>(DEVICES.phone)
  const { data, loading } = useQuery(getRecommendationsQuery, {
    variables: {
      campaignId,
      items: productCtx?.product?.productId
        ? [productCtx.product.productId]
        : [],
      itemsSource,
      itemsExcluded,
      additionalFilters,
      filtersJoiner,
      additionalElasticFilters,
      elasticFiltersJoiner,
      displayAttributes,
      includeContextItems,
    },
    ssr: false,
  })

  useEffect(() => {
    setDevice(getDevice())
  }, [])

  const recoData = data?.syneriseAIRecommendations.recommendations.data

  return (
    <Slider itemsPerPage={items[device]}>
      {loading &&
        Array(DEFAULT_ITEMS.desktop).fill(
          <div className={commonStyles['item-wrapper']} key={Math.random()}>
            <div className={commonStyles['item-container']}>
              <div className={commonStyles['item-loading']} />
            </div>
          </div>
        )}
      {recoData?.length > 0 &&
        recoData.map((productData: ProductData) => (
          <RecoItem key={productData.itemId} productData={productData} />
        ))}
    </Slider>
  )
}

RecoSlider.schema = {
  title: 'Synerise Recommendations',
  description:
    'Recommended items based on provided Synerise recommendation campaign ID',
  type: 'object',
  properties: {
    campaignId: {
      title: 'CampaignID',
      type: 'string',
    },
    items: {
      title: 'Items per page',
      type: 'object',
      default: DEFAULT_ITEMS,
      properties: {
        desktop: {
          title: 'Desktop',
          type: 'number',
        },
        tablet: {
          title: 'Tablet',
          type: 'number',
        },
        phone: {
          title: 'Phone',
          type: 'number',
        },
      },
    },
    itemsSource: {
      title: 'CampaignID',
      type: 'string',
    },
    itemsExcluded: {
      title: 'Excluded items',
      type: 'array',
      items: {
        title: 'Item ID',
        type: 'string',
      },
    },
    additionalFilters: {
      title: 'Additional filters',
      type: 'string',
    },
    filtersJoiner: {
      title: 'Filters joiner',
      type: 'string',
      default: 'AND',
      enum: ['AND', 'OR', 'REPLACE'],
    },
    additionalElasticFilters: {
      title: 'Additional elastic filters',
      type: 'string',
    },
    elasticFiltersJoiner: {
      title: 'Elastic filters joiner',
      type: 'string',
      default: 'AND',
      enum: ['AND', 'OR', 'REPLACE'],
    },
    displayAttributes: {
      title: 'Display attributes',
      type: 'array',
      items: {
        title: 'Attribute',
        type: 'string',
      },
    },
    includeContextItems: {
      title: 'Include context items',
      type: 'boolean',
      default: false,
    },
  },
}
