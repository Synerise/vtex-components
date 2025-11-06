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

  const rangeMin = `${filterKey}Min`
  const rangeMax = `${filterKey}Max`

  const defaultMin = safeQuery?.[rangeMin] ? +safeQuery[rangeMin] : min
  const defaultMax = safeQuery?.[rangeMax] ? +safeQuery[rangeMax] : max
  const [filterMinValue, setfilterMinValue] = useState(defaultMin)
  const [filterMaxValue, setfilterMaxValue] = useState(defaultMax)

  const onChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(+e.target.value, filterMaxValue)

    setfilterMinValue(value)
    e.target.value = value.toString()
  }

  const onChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(filterMinValue, +e.target.value)

    setfilterMaxValue(value)
    e.target.value = value.toString()
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
        [rangeMin]: filterMinValue === min ? undefined : filterMinValue,
        [rangeMax]: filterMaxValue === max ? undefined : filterMaxValue,
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
    rangeMin,
    rangeMax,
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
              ((filterMinValue - min) / (max - min)) * 100
            }% - ${thumbWidth / 2}px)`,
            width: `calc(${
              ((filterMaxValue - filterMinValue) / (max - min)) * 100
            }% + ${thumbWidth}px)`,
          }}
        />
        <input
          className={`${styles['range-slider']} ${styles['range-slider--min']}`}
          ref={filterMin}
          type="range"
          min={min}
          max={max}
          value={filterMinValue}
          onChange={onChangeMin}
        />
        <input
          className={`${styles['range-slider']} ${styles['range-slider--max']}`}
          ref={filterMax}
          type="range"
          min={min}
          max={max}
          value={filterMaxValue}
          onChange={onChangeMax}
        />
      </div>
    </div>
  )
}
