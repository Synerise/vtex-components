import React from 'react'

import styles from './ItemsList.css'

interface ItemsListContainerProps {
  children: React.ReactNode[]
}

export function ItemsListContainer({ children }: ItemsListContainerProps) {
  return <div className={styles['list-container']}>{children}</div>
}
