import React from 'react'

import styles from './UI.css'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  id: string
  selectHandler: (value: string) => void
  options: Array<{ value: string; label?: string }>
}

export function Select({
  label,
  id,
  selectHandler,
  options,
  ...restSelectProps
}: SelectProps) {
  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    selectHandler(event.target.value)
  }

  return (
    <div className={styles['select-container']}>
      <label htmlFor={id}>{label}</label>
      <select
        className={styles.select}
        id={id}
        onChange={onSelectChange}
        {...restSelectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </div>
  )
}
