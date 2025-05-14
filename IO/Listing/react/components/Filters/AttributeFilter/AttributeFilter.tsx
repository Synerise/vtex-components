import React, { useState } from 'react'

import { AttributeExpandBtn } from './AttributeExpandBtn'
import styles from './AttributeFilter.css'

interface AttributeFilterProps {
  title: string
  children: React.ReactNode
}

export function AttributeFilter({ title, children }: AttributeFilterProps) {
  const [expanded, setExpanded] = useState(true)

  const expandHandler = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <div className={styles['filter-item']}>
      <div className={styles.heading}>
        <h2 className={styles.header}>{title}</h2>
        <AttributeExpandBtn expanded={expanded} handleExpand={expandHandler} />
      </div>
      <div className={!expanded ? styles['filter-hidden'] : ''}>{children}</div>
    </div>
  )
}
