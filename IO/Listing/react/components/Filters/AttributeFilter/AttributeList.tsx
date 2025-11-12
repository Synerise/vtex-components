import React, { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import { AttributeItem } from './AttributeItem'
import styles from './AttributeFilter.css'
import { useSafeRuntime } from '../../../hooks'
import { useListingContext } from '../../../context'

interface AttributeListProps {
  filterKey: string
  facets: Record<string, number>
  defaultFilter: string
  showFacetCount?: boolean
}

export function AttributeList({
  filterKey,
  facets,
  defaultFilter,
  showFacetCount = false,
}: AttributeListProps) {
  const { setFilters } = useListingContext()
  const { setSafeQuery, safeQuery } = useSafeRuntime()
  const facetEntries = Object.entries(facets)
  const attributeQuery: undefined | string = safeQuery?.[filterKey]

  const queryFilters = useMemo(
    () => attributeQuery?.split(',').filter((attr) => attr.length) ?? [],
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

      setSafeQuery({
        [filterKey]: newItems.length ? newItems.join(',') : undefined,
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
