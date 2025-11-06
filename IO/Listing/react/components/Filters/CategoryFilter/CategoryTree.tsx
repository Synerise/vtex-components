import React, { useEffect, useMemo, useState } from 'react'

import { mapCategoriesToTree } from './utils'
import { CategoryList } from './CategoryList'
import { useSafeRuntime } from '../../../hooks'
import { useListingContext } from '../../../context'

interface CategoryTreeProps {
  facets: Record<string, number>
  filterKey: string
  defaultFilter?: string
  showFacetCount?: boolean
}

export function CategoryTree({
  facets,
  filterKey,
  defaultFilter = '',
  showFacetCount = false,
}: CategoryTreeProps) {
  const { setFilters } = useListingContext()
  const { setSafeQuery, safeQuery } = useSafeRuntime()
  const categoriesQuery: undefined | string = safeQuery?.[filterKey]

  const queryFilters = useMemo(
    () => categoriesQuery?.split(',').filter((cat) => cat.length) ?? [],
    [categoriesQuery]
  )

  const [categoriesState, setCategoriesState] = useState<string[]>(queryFilters)

  const categoryTree = useMemo(
    () => mapCategoriesToTree(facets, categoriesState),
    [facets, categoriesState]
  )

  useEffect(() => {
    setCategoriesState(queryFilters)
    setFilters((prevFilters) => {
      const isHighestSelected = defaultFilter.includes(queryFilters[0])

      return {
        ...prevFilters,
        [filterKey]:
          queryFilters.length && !isHighestSelected
            ? `${filterKey} IN ${JSON.stringify(queryFilters)}`
            : defaultFilter,
      }
    })
  }, [defaultFilter, filterKey, setFilters, queryFilters])

  const updateFilters = (selected: string[]) => {
    setSafeQuery({
      [filterKey]: selected.length ? selected.join(',') : undefined,
    })
    setCategoriesState(selected)
  }

  return (
    <CategoryList
      categoryTree={categoryTree}
      updateFilters={updateFilters}
      showFacetCount={showFacetCount}
    />
  )
}
