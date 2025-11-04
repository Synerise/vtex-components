import { useEffect, useState } from 'react'

import { SORTING_OPTIONS } from '../components/ItemsList/Sorting'
import type { OrderingType } from '../components/ItemsList/Sorting'
import type { FilterType } from '../components/Filters/utils'
import { useSafeRuntime } from './useSafeRuntime'

const DEFAULT_OPTS = {
  page: 1,
  pageSize: '24',
  sort: 'relevance',
  order: SORTING_OPTIONS.ASC,
}

export function useListingParams(defaultFilters: FilterType) {
  const { setQuerySafe, query } = useSafeRuntime()

  const pageQuery = Number(query?.page) || DEFAULT_OPTS.page
  const pageSizeQuery = query?.pageSize ?? DEFAULT_OPTS.pageSize
  const sortQuery = query?.sort ?? DEFAULT_OPTS.sort
  const orderQuery =
    query?.order === SORTING_OPTIONS.DESC
      ? SORTING_OPTIONS.DESC
      : SORTING_OPTIONS.ASC

  const [page, setPage] = useState(pageQuery)
  const [pageSize, setPageSize] = useState(pageSizeQuery)
  const [sortBy, setSortBy] = useState(sortQuery)
  const [ordering, setOrdering] = useState<OrderingType>(orderQuery)
  const [filters, setFilters] = useState<FilterType>(defaultFilters)

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

  useEffect(() => {
    // update listing settings with query change
    setPage(pageQuery)
    setPageSize(pageSizeQuery)
    setSortBy(sortQuery)
    setOrdering(orderQuery)
  }, [pageQuery, pageSizeQuery, sortQuery, orderQuery])

  useEffect(() => {
    setFilters(defaultFilters)
  }, [defaultFilters])

  useEffect(() => {
    // page reset to 1
    setPage(DEFAULT_OPTS.page)
    setTimeout(() => setQuerySafe({ page: undefined }))
  }, [filters, pageSize, sortBy, ordering, setQuerySafe])

  return {
    sortBy,
    setSortByHandler,
    ordering,
    switchOrderingHandler,
    page,
    setPageHandler,
    pageSize,
    setPageSizeHandler,
    filters,
    setFilters,
    defaultFilters,
  }
}
