import React from 'react'

import { Filters } from './Filters'
import styles from './ListingStyles.css'
import { ItemsList, ItemsListContainer, ItemsListTopBar } from './ItemsList'
import { Pagination } from './ItemsList/Pagination'
import type { FilterableFacetType } from '../types/FilterTypes'
import { useSafeRuntime, useSearch } from '../hooks'

interface ListingProps {
  indexId: string
  personalize: boolean
  sortByMetric: 'TransactionsPopularity' | 'PageVisitsPopularity'
  listingFilterAttribute: string
  filterableFacets: FilterableFacetType[]
  showFacetsValue: boolean
  facetsSize: number
  maxValuesPerFacet: number
  distinctFilter: {
    attribute: string
    maxNumItems: number
    levelRangeModifier: number
  }
  ignoreQueryRules: boolean
}

export function ListingSection({
  indexId,
  personalize,
  sortByMetric,
  listingFilterAttribute,
  filterableFacets,
  showFacetsValue,
  facetsSize,
  maxValuesPerFacet,
  distinctFilter,
  ignoreQueryRules,
}: ListingProps) {
  const { deviceInfo } = useSafeRuntime()
  const { loading, data, facets, totalPages, isSearch, resCorrelationId } =
    useSearch(
      {
        indexId,
        personalize,
        sortByMetric,
        facetsSize,
        maxValuesPerFacet,
        distinctFilter,
        ignoreQueryRules,
      },
      filterableFacets
    )

  return (
    <section
      className={`${styles['listing-container']} ${
        loading ? styles.loading : ''
      }`}
    >
      {facets && (
        <Filters
          facets={facets}
          filterableFacets={filterableFacets}
          defaultAttribute={listingFilterAttribute}
          showFacetsValue={showFacetsValue}
        />
      )}
      <ItemsListContainer>
        <ItemsListTopBar />
        {data?.data.length ? (
          <ItemsList
            items={data.data}
            correlationId={resCorrelationId}
            searchType={isSearch ? 'full-text-search' : 'listing'}
          />
        ) : (
          !loading && "We can't find products matching the selection."
        )}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            maxVisible={deviceInfo.isMobile ? 3 : 5}
          />
        )}
      </ItemsListContainer>
    </section>
  )
}
