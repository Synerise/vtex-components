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
  const { setSafeQuery, safeQuery } = useSafeRuntime()

  const pageQuery = Number(safeQuery?.page) || DEFAULT_OPTS.page
  const pageSizeQuery = safeQuery?.pageSize ?? DEFAULT_OPTS.pageSize
  const sortQuery = safeQuery?.sort ?? DEFAULT_OPTS.sort
  const orderQuery =
    safeQuery?.order === SORTING_OPTIONS.DESC
      ? SORTING_OPTIONS.DESC
      : SORTING_OPTIONS.ASC

  const [page, setPage] = useState(pageQuery)
  const [pageSize, setPageSize] = useState(pageSizeQuery)
  const [sortBy, setSortBy] = useState(sortQuery)
  const [ordering, setOrdering] = useState<OrderingType>(orderQuery)
  const [filters, setFilters] = useState<FilterType>(defaultFilters)

  const setPageHandler = (newPage: number) => {
    setPage(newPage)
    setSafeQuery({ page: newPage === DEFAULT_OPTS.page ? undefined : newPage })
  }

  const setPageSizeHandler = (newPageSize: string) => {
    setPageSize(newPageSize)
    setSafeQuery({
      pageSize: newPageSize === DEFAULT_OPTS.pageSize ? undefined : newPageSize,
    })
  }

  const setSortByHandler = (newSortBy: string) => {
    setSortBy(newSortBy)
    setSafeQuery({
      sort: newSortBy === DEFAULT_OPTS.sort ? undefined : newSortBy,
    })
  }

  const switchOrderingHandler = () => {
    setOrdering((prev) => {
      const newOrdering =
        prev === SORTING_OPTIONS.ASC
          ? SORTING_OPTIONS.DESC
          : SORTING_OPTIONS.ASC

      setSafeQuery({
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
    setTimeout(() => setSafeQuery({ page: undefined }))
  }, [filters, pageSize, sortBy, ordering, setSafeQuery])

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
