import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-apollo'
import type { QueryHookOptions } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { getListingQuery, getSearchQuery } from '../graphql/Queries'
import { Filters } from './Filters'
import type { FilterType } from './Filters/utils'
import styles from './ListingStyles.css'
import { ItemsList, ItemsListContainer, ItemsListTopBar } from './ItemsList'
import { Pagination } from './ItemsList/Pagination'
import { SORTING_OPTIONS } from './ItemsList/Sorting'
import type { OrderingType } from './ItemsList/Sorting'
import type { FilterableFacetType } from '../types/FilterTypes'

export type FacetType = Record<string, Record<string, number>>

const DEFAULT_FILTERS: FilterableFacetType[] = [
  {
    __editorItemTitle: 'Category',
    key: 'category',
    title: 'Category',
    type: 'tree',
  },
  {
    __editorItemTitle: 'Price',
    key: 'salePrice.value',
    title: 'Price',
    type: 'price',
  },
  { __editorItemTitle: 'Brand', key: 'brand', title: 'Brand', type: 'list' },
]

const DEFAULT_OPTS = {
  page: 1,
  pageSize: '24',
  sort: 'relevance',
  order: SORTING_OPTIONS.ASC,
}

interface ListingProps {
  indexId: string
  personalize: boolean
  sortByMetric: 'TransactionsPopularity' | 'PageVisitsPopularity'
  listingFilterAttribute: string
  filterableFacets: FilterableFacetType[]
  facetsSize: number
  maxValuesPerFacet: number
  distinctFilter: {
    attribute: string
    maxNumItems: number
    levelRangeModifier: number
  }
  ignoreQueryRules: boolean
}

export function Listing({
  indexId,
  personalize,
  sortByMetric,
  listingFilterAttribute = 'category',
  filterableFacets = DEFAULT_FILTERS,
  facetsSize,
  maxValuesPerFacet,
  distinctFilter,
  ignoreQueryRules,
}: ListingProps) {
  const { query, setQuery, route, deviceInfo } = useRuntime()
  const searchQuery = query?.q
  const { attributeValue } = route.params
  const isSearch = attributeValue === 'search'
  const defaultAttributeFilter = !isSearch
    ? `${listingFilterAttribute} IN ["${attributeValue}"]`
    : ''

  const defaultFilters = useMemo(
    () => ({
      [listingFilterAttribute]: defaultAttributeFilter,
    }),
    [listingFilterAttribute, defaultAttributeFilter]
  )

  const customFilteredFacets: Record<string, string> = useMemo(
    () =>
      filterableFacets.reduce(
        (customFacets, facet) => ({
          ...customFacets,
          [facet.key]: defaultAttributeFilter,
        }),
        {}
      ),
    [defaultAttributeFilter, filterableFacets]
  )

  const correlationIdQuery = query?.correlationId
  const pageQuery = Number(query?.page) || DEFAULT_OPTS.page
  const pageSizeQuery = query?.pageSize ?? DEFAULT_OPTS.pageSize
  const sortQuery = query?.sort ?? DEFAULT_OPTS.sort
  const orderQuery =
    query?.order === SORTING_OPTIONS.DESC
      ? SORTING_OPTIONS.DESC
      : SORTING_OPTIONS.ASC

  const correlationId = useRef<string | undefined>(correlationIdQuery)
  const [page, setPage] = useState(pageQuery)
  const [pageSize, setPageSize] = useState(pageSizeQuery)
  const [sortBy, setSortBy] = useState(sortQuery)
  const [ordering, setOrdering] = useState<OrderingType>(orderQuery)
  const [filters, setFilters] = useState<FilterType>(defaultFilters)

  // disable url change on site editor panel
  const isSiteEditor = route.queryString?.__siteEditor
  const setQuerySafe = useCallback(
    (q: Record<string, string | number | undefined>) =>
      !isSiteEditor && setQuery(q),
    [isSiteEditor, setQuery]
  )

  useEffect(() => {
    // update listing settings with query change
    setPage(pageQuery)
    setPageSize(pageSizeQuery)
    setSortBy(sortQuery)
    setOrdering(orderQuery)
  }, [pageQuery, pageSizeQuery, sortQuery, orderQuery])

  const setPageHandler = (newPage: number) => {
    setPage(newPage)
    setQuerySafe({ page: newPage === DEFAULT_OPTS.page ? undefined : newPage })
  }

  const setPageSizeHandler = (newPageSize: string) => {
    setPageSize(newPageSize)
    setQuerySafe({
      pageSize: newPageSize === DEFAULT_OPTS.pageSize ? undefined : newPageSize,
    })
  }

  const setSortByHandler = (newSortBy: string) => {
    setSortBy(newSortBy)
    setQuerySafe({
      sort: newSortBy === DEFAULT_OPTS.sort ? undefined : newSortBy,
    })
  }

  const switchOrderingHandler = () => {
    setOrdering((prev) => {
      const newOrdering =
        prev === SORTING_OPTIONS.ASC
          ? SORTING_OPTIONS.DESC
          : SORTING_OPTIONS.ASC

      setQuerySafe({
        order: newOrdering === DEFAULT_OPTS.order ? undefined : newOrdering,
      })

      return newOrdering
    })
  }

  const filtersIQL = useMemo(() => {
    return Object.values(filters)
      .filter((filter) => filter.length)
      .join(' AND ')
  }, [filters])

  useEffect(() => {
    // page reset to 1
    setPage(DEFAULT_OPTS.page)
    setTimeout(() => setQuerySafe({ page: undefined }))
  }, [filters, pageSize, sortBy, ordering, setQuerySafe])

  const commonQueryOptions: QueryHookOptions = {
    variables: {
      indexId,
      query: searchQuery,
      personalize,
      correlationId: correlationId.current,
      sortByMetric,
      facetsSize,
      maxValuesPerFacet,
      ...(distinctFilter?.attribute ? { distinctFilter } : {}),
      ignoreQueryRules,
      customFilteredFacets,
      facets: filterableFacets.map((facet) => facet.key),
      includeFacets: 'none',
      filters: filtersIQL,
      sortBy,
      ordering,
      page,
      limit: +pageSize,
    },
    ssr: false,
  }

  const { data: searchData, loading: searchLoading } = useQuery(
    getSearchQuery,
    {
      ...commonQueryOptions,
      skip: !isSearch,
    }
  )

  const { data: listingData, loading: listingLoading } = useQuery(
    getListingQuery,
    {
      ...commonQueryOptions,
      skip: isSearch,
    }
  )

  const loading = searchLoading || listingLoading

  const data = isSearch
    ? searchData?.syneriseAISearch.search
    : listingData?.syneriseAISearch.listing

  const totalPages = data?.meta.totalPages
  const facets = data?.extras.customFilteredFacets
  const resCorrelationId = data?.extras.correlationId

  useEffect(() => {
    correlationId.current = undefined
    setTimeout(() => setQuerySafe({ correlationId: resCorrelationId }))
  }, [resCorrelationId, setQuerySafe])

  return (
    <section
      className={`${styles['listing-container']} ${
        loading ? styles.loading : ''
      }`}
    >
      {facets && (
        <Filters
          facets={facets}
          setFilters={setFilters}
          filterableFacets={filterableFacets}
          defaultAttribute={listingFilterAttribute}
          defaultAttributeFilter={defaultAttributeFilter}
        />
      )}
      <ItemsListContainer>
        <ItemsListTopBar
          ordering={ordering}
          switchOrdering={switchOrderingHandler}
          sortBy={sortBy}
          setSortBy={setSortByHandler}
          pageSize={pageSize}
          setPageSize={setPageSizeHandler}
        />
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
            page={page}
            totalPages={totalPages}
            onPageChange={setPageHandler}
            maxVisible={deviceInfo.isMobile ? 3 : 5}
          />
        )}
      </ItemsListContainer>
    </section>
  )
}

Listing.schema = {
  title: 'Synerise listing and search results',
  description: 'Listing and search results component for Synerise AI Search',
  type: 'object',
  properties: {
    indexId: {
      title: 'Index ID',
      description: 'ID of the index to be used in the search operation',
      type: 'string',
    },
    personalize: {
      title: 'Personalize',
      description: 'If set to false, the search result is not personalized.',
      type: 'boolean',
      default: true,
    },
    sortByMetric: {
      title: 'Sort by metric',
      description: 'Name of the metric by which the data will be sorted.',
      type: 'string',
      enum: ['TransactionsPopularity', 'PageVisitsPopularity'],
    },
    listingFilterAttribute: {
      title: 'Listing Filter Attribute',
      description:
        'Defines which attribute should be automatically filtered based on the URL path (e.g. if set to category, path /shoes sets default filter to category=shoes). Common values: category, brand, etc.',
      type: 'string',
      default: 'category',
    },
    filterableFacets: {
      title: 'Filters',
      type: 'array',
      items: {
        type: 'object',
        title: 'Filter',
        properties: {
          __editorItemTitle: {
            title: 'Item name',
            default: 'Filter item',
            type: 'string',
          },
          title: {
            title: 'Title',
            type: 'string',
          },
          key: {
            title: 'Key',
            type: 'string',
            description: 'Catalog key of the filter.',
          },
          type: {
            title: 'Type',
            type: 'string',
            enum: ['list', 'tree', 'price'],
            description: 'Type of the filter to be applied.',
          },
        },
      },
      default: DEFAULT_FILTERS,
    },
    facetsSize: {
      title: 'Facets size',
      description:
        'Determines how many items will be used for facets aggregation. [1-10000]',
      type: 'number',
      default: 2000,
    },
    maxValuesPerFacet: {
      title: 'Max values per facet',
      description:
        'Determines how many values will be retrieved per facet. [1-1000]',
      type: 'number',
      default: 50,
    },
    distinctFilter: {
      type: 'object',
      title: 'Distinct filter',
      description:
        'Distinct filters regulate how many items with the same value of a particular attribute can be returned.',
      properties: {
        attribute: {
          type: 'string',
          title: 'Attribute',
          description: 'Name of the attribute to be used for distinct filter.',
        },
        maxNumItems: {
          type: 'number',
          title: 'Max number of items',
          description:
            'Maximum number of items to be returned per each distinct attribute value.',
        },
        levelRangeModifier: {
          type: 'number',
          title: 'Level range modifier',
          description:
            'Level of the category, if the category attribute was used for distinct filter.',
        },
      },
    },
    ignoreQueryRules: {
      title: 'Ignore query rules',
      description: 'If set to true, query rules are not applied.',
      type: 'boolean',
      default: false,
    },
  },
}
