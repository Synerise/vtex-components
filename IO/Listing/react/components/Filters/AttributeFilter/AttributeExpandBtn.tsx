import React from 'react'

import styles from './AttributeFilter.css'

interface AttributeExpandBtnProps {
  expanded: boolean
  handleExpand: () => void
}

export function AttributeExpandBtn({
  expanded,
  handleExpand,
}: AttributeExpandBtnProps) {
  return (
    <button className={styles['expand-btn']} onClick={handleExpand}>
      {expanded ? '-' : '+'}
    </button>
  )
}
