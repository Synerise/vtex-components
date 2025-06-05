import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { FormattedNumber } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import styles from './PriceFilter.css'
import type { FilterType } from '../utils'

const FILTER_DEBOUNCE_TIME_MS = 500

interface PriceFilterProps {
  min: number
  max: number
  defaultMin?: number
  defaultMax?: number
  filterKey: string
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  thumbWidth?: number
}

export function PriceFilter({
  min,
  max,
  filterKey,
  setFilters,
  thumbWidth = 8,
}: PriceFilterProps) {
  const { culture, setQuery, query } = useRuntime()
  const { currency } = culture
  const filterMin = useRef<HTMLInputElement>(null)
  const filterMax = useRef<HTMLInputElement>(null)

  const defaultMin = query?.priceMin ? +query.priceMin : min
  const defaultMax = query?.priceMax ? +query.priceMax : max
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
    const priceFilterIQL = `${filterKey} >= ${filterMinValue} AND ${filterKey} <= ${filterMaxValue}`

    const timeout = setTimeout(() => {
      setQuery({
        priceMin: filterMinValue === min ? undefined : filterMinValue,
        priceMax: filterMaxValue === max ? undefined : filterMaxValue,
      })

      setFilters((prev) => ({
        ...prev,
        [`${filterKey}`]: isMinMaxSet ? '' : priceFilterIQL,
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
    setQuery,
  ])

  return (
    <div
      className={styles['price-filter__container']}
      style={{ '--thumb-width': `${thumbWidth}px` } as React.CSSProperties}
    >
      <div className={styles['price-values__container']}>
        <span className={styles['price-value']}>
          <FormattedNumber
            value={filterMinValue}
            style="currency"
            currency={currency}
          />
        </span>
        <span className={styles['price-value']}>
          <FormattedNumber
            value={filterMaxValue}
            style="currency"
            currency={currency}
          />
        </span>
      </div>
      <div className={styles['price-sliders__container']}>
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
          className={`${styles['price-slider']} ${styles['price-slider--min']}`}
          ref={filterMin}
          type="range"
          min={min}
          max={max}
          value={filterMinValue}
          onChange={onChangeMin}
        />
        <input
          className={`${styles['price-slider']} ${styles['price-slider--max']}`}
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
