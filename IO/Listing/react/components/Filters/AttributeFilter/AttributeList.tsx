import React, { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { AttributeItem } from './AttributeItem'
import styles from './AttributeFilter.css'
import type { FilterType } from '../utils'

interface AttributeListProps {
  filterKey: string
  facets: Record<string, number>
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  defaultFilter: string
  showFacetCount?: boolean
}

export function AttributeList({
  filterKey,
  facets,
  setFilters,
  defaultFilter,
  showFacetCount = false,
}: AttributeListProps) {
  const { setQuery, query } = useRuntime()
  const attributeQuery: undefined | string | string[] = query?.[filterKey]
  const facetEntries = Object.entries(facets)
  const queryFilters = useMemo(
    () =>
      attributeQuery
        ?.replace(/---/g, ' & ')
        .split(',')
        .filter((attr) => attr.length) ?? [],
    [attributeQuery]
  )

  const [itemsState, setItemsState] = useState<string[]>(queryFilters)

  useEffect(() => {
    setItemsState(queryFilters)
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: queryFilters.length
        ? `${filterKey} IN ${JSON.stringify(queryFilters)}`
        : defaultFilter,
    }))
  }, [queryFilters, setFilters, filterKey, defaultFilter])

  const updateFilters = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    setItemsState((prev) => {
      const newItems = checked
        ? [...prev, value]
        : prev.filter((val) => value !== val)

      setQuery({
        [filterKey]: newItems.length
          ? newItems.join(',').replace(/ & /g, '---')
          : undefined,
      })

      return newItems
    })
  }

  return (
    <ul className={styles.list}>
      {facetEntries.map(([name, count]) => (
        <li className={styles['list-item']} key={name}>
          <AttributeItem
            value={name}
            name={name}
            count={count}
            inputHandler={updateFilters}
            showFacetCount={showFacetCount}
            checked={itemsState.includes(name)}
          />
        </li>
      ))}
    </ul>
  )
}
