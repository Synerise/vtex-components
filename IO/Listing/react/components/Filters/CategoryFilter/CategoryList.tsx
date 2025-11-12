import React from 'react'

import { reduceTreeToBranchingPoint } from './utils'
import type { CategoryTreeType } from './utils'
import { CategoryItem } from './CategoryItem'
import styles from './CategoryFilter.css'
import filterStyles from '../AttributeFilter/AttributeFilter.css'

interface CategoryListProps {
  categoryTree: CategoryTreeType
  updateFilters: (categories: string[]) => void
  expanded?: boolean
  showFacetCount?: boolean
}

export function CategoryList({
  categoryTree,
  updateFilters,
  expanded = true,
  showFacetCount = false,
}: CategoryListProps) {
  const categories = Object.entries(reduceTreeToBranchingPoint(categoryTree))

  return (
    <ul className={`${filterStyles.list} ${expanded ? '' : styles.hidden}`}>
      {categories.map(([category, subtree]) => (
        <CategoryItem
          key={subtree.value}
          name={category}
          categoryData={subtree}
          updateFilters={updateFilters}
          showFacetCount={showFacetCount}
        />
      ))}
    </ul>
  )
}
