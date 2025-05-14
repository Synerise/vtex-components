import React from 'react'

import styles from './AttributeFilter.css'

interface AttributeItemProps {
  value: string
  name: string
  count: number
  inputHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  showFacetCount?: boolean
  checked?: boolean
}

export function AttributeItem({
  value,
  name,
  count,
  inputHandler,
  inputRef,
  showFacetCount = false,
  checked,
}: AttributeItemProps) {
  const itemId = `item--${name}-${Math.random()}`

  return (
    <>
      <input
        ref={inputRef}
        id={itemId}
        className={styles.item__input}
        type="checkbox"
        onChange={inputHandler}
        value={value}
        checked={checked}
      />
      <label htmlFor={itemId} className={styles.item__label}>
        <span className={styles.item__name}>{name}</span>
        {showFacetCount && <span className={styles.item__count}>{count}</span>}
      </label>
    </>
  )
}
