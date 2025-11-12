import React, { createContext, useContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

import { useListingParams, useSafeRuntime } from '../../hooks'
import { SORTING_OPTIONS } from '../../components/ItemsList/Sorting'
import type { OrderingType } from '../../components/ItemsList/Sorting'
import type { FilterType } from '../../components/Filters/utils'

interface ListingContextType {
  sortBy: string
  setSortByHandler: (sortBy: string) => void
  ordering: OrderingType
  switchOrderingHandler: () => void
  page: number
  setPageHandler: (page: number) => void
  pageSize: string
  setPageSizeHandler: (pageSize: string) => void
  filters: FilterType
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  defaultFilters: FilterType
}

export const DEFAULT_OPTS = {
  page: 1,
  pageSize: '24',
  sort: 'relevance',
  order: SORTING_OPTIONS.ASC,
}

const ListingContext = createContext<ListingContextType>({
  sortBy: DEFAULT_OPTS.sort,
  setSortByHandler: () => {},
  ordering: DEFAULT_OPTS.order,
  switchOrderingHandler: () => {},
  page: DEFAULT_OPTS.page,
  setPageHandler: () => {},
  pageSize: DEFAULT_OPTS.pageSize,
  setPageSizeHandler: () => {},
  filters: {},
  setFilters: () => {},
  defaultFilters: {},
})

type ListingContextProps = PropsWithChildren<{
  contextFilterAttribute: string
}>

export function ListingContextProvider({
  children,
  contextFilterAttribute,
}: ListingContextProps) {
  const { query, route } = useSafeRuntime()
  const {
    department,
    category = undefined,
    subcategory = undefined,
    term = undefined,
  } = route.params

  const searchQuery = query?.q ?? term
  const path = [department, category, subcategory]
    .filter((el) => !!el)
    .join('>')
    ?.replace(/---/g, ' & ')
    .replace(/-/g, ' ')

  const isSearch = !!searchQuery
  const defaultAttributeFilter = !isSearch
    ? `${contextFilterAttribute} IN ["${path}"]`
    : ''

  const defaultFilters = useMemo(
    () => ({
      [contextFilterAttribute]: defaultAttributeFilter,
    }),
    [contextFilterAttribute, defaultAttributeFilter]
  )

  const listing = useListingParams(defaultFilters)

  return (
    <ListingContext.Provider value={listing}>
      {children}
    </ListingContext.Provider>
  )
}

export function useListingContext() {
  const ctx = useContext(ListingContext)

  if (!ctx) {
    throw new Error(
      'useListingContext can be only used inside ListingContextProvider'
    )
  }

  return ctx
}
