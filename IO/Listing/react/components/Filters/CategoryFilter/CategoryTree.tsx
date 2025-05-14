import React, { useEffect, useMemo, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { mapCategoriesToTree } from './utils'
import { CategoryList } from './CategoryList'
import type { FilterType } from '../utils'

interface CategoryTreeProps {
  facets: Record<string, number>
  filterKey: string
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  defaultFilter?: string
  showFacetCount?: boolean
}

export function CategoryTree({
  facets,
  filterKey,
  setFilters,
  defaultFilter = '',
  showFacetCount = false,
}: CategoryTreeProps) {
  const { setQuery, query } = useRuntime()
  const categoriesQuery: undefined | string = query?.[filterKey]
  const queryFilters = useMemo(
    () =>
      categoriesQuery
        ?.replace(/---/g, ' & ')
        .split(',')
        .filter((cat) => cat.length) ?? [],
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
      return {
        ...prevFilters,
        [filterKey]: queryFilters.length
          ? `${filterKey} IN ${JSON.stringify(queryFilters)}`
          : defaultFilter,
      }
    })
  }, [defaultFilter, filterKey, setFilters, queryFilters])

  const updateFilters = (selectedCategories: string[]) => {
    setQuery({
      [filterKey]: selectedCategories.length
        ? selectedCategories.join(',').replace(/ & /g, '---')
        : undefined,
    })
    setCategoriesState(selectedCategories)
  }

  return (
    <CategoryList
      categoryTree={categoryTree}
      updateFilters={updateFilters}
      showFacetCount={showFacetCount}
    />
  )
}
