import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'

import type { ProductDataType } from '../../types/ProductTypes'
import styles from './SearchResults.css'
import { SearchResultsList } from './SearchResultsList'
import { getRecommendationsQuery } from '../../graphql/Queries'
import { SearchHints } from './Suggestions/SearchHints'
import { SearchContext } from '../Search'

interface SearchResultsProps {
  products: ProductDataType[]
  loading: boolean
  recommendations: {
    recommendationIdNoResults: string
    recommendationHeadingNoResults: string
    recommendationIdNoQuery: string
    recommendationHeadingNoQuery: string
  }
  showRecent: boolean
  showPopular: boolean
}

export function SearchResults({
  products,
  loading,
  recommendations,
  showRecent,
  showPopular,
}: SearchResultsProps) {
  const { debouncedQuery: query } = useContext(SearchContext)
  const {
    recommendationIdNoResults: recoNoResults,
    recommendationHeadingNoResults: recoHeadingNoResults,
    recommendationHeadingNoQuery: recoHeadingNoQuery,
    recommendationIdNoQuery: recoNoQuery,
  } = recommendations

  const showRecoNoQuery = !!recoNoQuery.length
  const showRecoNoResults =
    !!recoNoResults.length && !!query.length && !products.length && !loading

  const showRecommendation = showRecoNoQuery || showRecoNoResults

  const showResults = !!query.length && !!products.length
  const showSearchHints = showRecent || showPopular

  const recoId = showRecoNoResults ? recoNoResults : recoNoQuery

  const { data: recommendationData } = useQuery(getRecommendationsQuery, {
    variables: {
      campaignId: recoId,
    },
    onCompleted: (data) => {
      if (typeof SR === 'undefined') return
      const {
        data: recoData,
        extras: { correlationId },
      } = data.syneriseAIRecommendations.recommendations

      SR.event.recommendationView({
        campaignId: recoId,
        correlationId,
        items: recoData.map(({ itemId }: { itemId: string }) => itemId),
      })
    },
    ssr: false,
    skip: !showRecommendation,
  })

  const recommendationProducts =
    recommendationData?.syneriseAIRecommendations.recommendations.data ?? []

  const recommendationHeading = showRecoNoResults
    ? recoHeadingNoResults
    : recoHeadingNoQuery

  const results = showResults ? products : recommendationProducts
  const heading = showResults ? 'Search results' : recommendationHeading

  return (
    <div className={styles['search-results-container']}>
      <SearchResultsList products={results} heading={heading} />
      {showSearchHints && (
        <SearchHints showPopular={showPopular} showRecent={showRecent} />
      )}
    </div>
  )
}
