import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { FormattedNumber } from 'react-intl'

import styles from './RangeFilter.css'
import { useSafeRuntime } from '../../../hooks'
import { useListingContext } from '../../../context'

const FILTER_DEBOUNCE_TIME_MS = 500

interface RangeFilterProps {
  min: number
  max: number
  defaultMin?: number
  defaultMax?: number
  filterKey: string
  thumbWidth?: number
}

export function RangeFilter({
  min,
  max,
  filterKey,
  thumbWidth = 8,
}: RangeFilterProps) {
  const { setFilters } = useListingContext()
  const { culture, setSafeQuery, safeQuery } = useSafeRuntime()
  const { currency } = culture
  const filterMin = useRef<HTMLInputElement>(null)
  const filterMax = useRef<HTMLInputElement>(null)

  const keyMin = `${filterKey}Min`
  const keyMax = `${filterKey}Max`

  const rangeLocked = min === max
  const defaultMin = rangeLocked ? min : Number(safeQuery?.[keyMin] ?? min)
  const defaultMax = rangeLocked ? max : Number(safeQuery?.[keyMax] ?? max)
  const [filterMinValue, setfilterMinValue] = useState(defaultMin)
  const [filterMaxValue, setfilterMaxValue] = useState(defaultMax)

  const rangeMin = Math.min(min, filterMinValue)
  const rangeMax = Math.max(max, filterMaxValue)

  const onChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
    setfilterMinValue(+e.target.value)
  }

  const onChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
    setfilterMaxValue(+e.target.value)
  }

  // initial filter values
  useEffect(() => {
    setfilterMinValue(defaultMin)
    setfilterMaxValue(defaultMax)
  }, [defaultMin, defaultMax])

  // debounced filter changes
  useEffect(() => {
    if (!filterMin.current || !filterMax.current) return

    const isMinMaxSet = filterMinValue === min && filterMaxValue === max
    const rangeFilterIQL = `${filterKey} >= ${filterMinValue} AND ${filterKey} <= ${filterMaxValue}`

    const timeout = setTimeout(() => {
      setSafeQuery({
        [keyMin]: filterMinValue === min ? undefined : filterMinValue,
        [keyMax]: filterMaxValue === max ? undefined : filterMaxValue,
      })

      setFilters((prev) => ({
        ...prev,
        [`${filterKey}`]: isMinMaxSet ? '' : rangeFilterIQL,
      }))
    }, FILTER_DEBOUNCE_TIME_MS)

    return () => clearTimeout(timeout)
  }, [
    filterMinValue,
    filterMaxValue,
    filterKey,
    setFilters,
    min,
    max,
    setSafeQuery,
    keyMin,
    keyMax,
  ])

  return (
    <div
      className={styles['range-filter__container']}
      style={{ '--thumb-width': `${thumbWidth}px` } as React.CSSProperties}
    >
      <div className={styles['range-values__container']}>
        <span className={styles['range-value']}>
          <FormattedNumber
            value={filterMinValue}
            style="currency"
            currency={currency}
          />
        </span>
        <span className={styles['range-value']}>
          <FormattedNumber
            value={filterMaxValue}
            style="currency"
            currency={currency}
          />
        </span>
      </div>
      <div className={styles['range-sliders__container']}>
        <div className={styles.track} />
        <div
          className={styles.range}
          style={{
            marginLeft: `calc(${
              ((filterMinValue - rangeMin) / (rangeMax - rangeMin)) * 100
            }% - ${thumbWidth / 2}px)`,
            width: `calc(${
              ((filterMaxValue - filterMinValue) / (rangeMax - rangeMin)) * 100
            }% + ${thumbWidth}px)`,
          }}
        />
        <input
          className={`${styles['range-slider']} ${styles['range-slider--min']}`}
          ref={filterMin}
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={filterMinValue}
          onChange={onChangeMin}
          disabled={rangeMin === rangeMax}
        />
        <input
          className={`${styles['range-slider']} ${styles['range-slider--max']}`}
          ref={filterMax}
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={filterMaxValue}
          onChange={onChangeMax}
          disabled={rangeMin === rangeMax}
        />
      </div>
    </div>
  )
}
