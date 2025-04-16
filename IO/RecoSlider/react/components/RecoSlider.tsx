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
  itemsSource: { type: 'aggregate' | 'expression'; id: string }
  itemsExcluded: string
  additionalFilters: string
  filtersJoiner: string
  additionalElasticFilters: string
  elasticFiltersJoiner: string
  displayAttributes: string
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
      ...(itemsSource.id && {itemsSource}),
      itemsExcluded: itemsExcluded?.split(','),
      additionalFilters,
      filtersJoiner,
      additionalElasticFilters,
      elasticFiltersJoiner,
      displayAttributes: displayAttributes?.split(','),
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
      title: 'Campaign ID',
      description: 'Campaign ID for establishing the context',
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
      title: 'Items Source',
      description:
        'Source of the Item ID or item IDs for the recommendation context.',
      type: 'object',
      properties: {
        type: {
          title: "Type of the item's source",
          type: 'string',
          default: 'aggregate',
          enum: ['aggregate', 'expression'],
        },
        id: {
          title: "ID of the item's source (aggregate or expression)",
          type: 'string',
        },
      },
    },
    itemsExcluded: {
      title: 'Excluded items',
      description:
        'Items (identified by itemId in the item feed) that will be excluded from the generated recommendations. For example, items already added to the basket. Seperated item IDs with a comma.',
      type: 'string',
    },
    additionalFilters: {
      title: 'Additional filters',
      description:
        "Additional filters. These are merged with the campaign's own filters according to the logic in filtersJoiner.",
      type: 'string',
    },
    filtersJoiner: {
      title: 'Filters joiner',
      description:
        "Defines the logic of merging additionalFilters with the campaign's existing filters.",
      type: 'string',
      default: 'AND',
      enum: ['AND', 'OR', 'REPLACE'],
    },
    additionalElasticFilters: {
      title: 'Additional elastic filters',
      description:
        "Additional elastic filters. These are merged with the campaign's own elastic filters according to the logic in elasticFiltersJoiner.",
      type: 'string',
    },
    elasticFiltersJoiner: {
      title: 'Elastic filters joiner',
      description:
        "Defines the logic of merging additionalElasticFilters with the campaign's existing elastic filters.",
      type: 'string',
      default: 'AND',
      enum: ['AND', 'OR', 'REPLACE'],
    },
    displayAttributes: {
      title: 'Display attributes',
      description:
        'An array of item attributes which value will be returned in a recommendation response. The array will be merged together with the configuration of the recommendation. Seperated attributes with a comma.',
      type: 'string',
    },
    includeContextItems: {
      title: 'Include context items',
      description:
        'When true, the recommendation response will include context items metadata.',
      type: 'boolean',
      default: false,
    },
  },
}
