import React, { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import filterStyles from '../AttributeFilter/AttributeFilter.css'
import { CATEGORY_STATE, setCheckedCategory } from './utils'
import type { CategoryLevelType } from './utils'
import { CategoryList } from './CategoryList'
import { AttributeItem, AttributeExpandBtn } from '../AttributeFilter'

interface CategoryItemProps {
  name: string
  categoryData: CategoryLevelType
  updateFilters: (categories: string[]) => void
  showFacetCount?: boolean
}

export function CategoryItem({
  name,
  categoryData,
  updateFilters,
  showFacetCount = false,
}: CategoryItemProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [expanded, setExpanded] = useState(false)
  const childrenLength = Object.keys(categoryData.children).length

  if (inputRef.current) {
    if (categoryData.state === CATEGORY_STATE.checked) {
      inputRef.current.checked = true
      inputRef.current.indeterminate = false
    } else if (categoryData.state === CATEGORY_STATE.unchecked) {
      inputRef.current.checked = false
      inputRef.current.indeterminate = false
    } else {
      inputRef.current.checked = false
      inputRef.current.indeterminate = true
    }
  }

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked
      ? CATEGORY_STATE.checked
      : CATEGORY_STATE.unchecked

    const selected = setCheckedCategory(categoryData, value)

    updateFilters(selected)
  }

  const handleExpand = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <li>
      <div className={filterStyles['list-item']}>
        <AttributeItem
          value={categoryData.value}
          name={name}
          count={categoryData.count}
          inputHandler={inputHandler}
          inputRef={inputRef}
          showFacetCount={showFacetCount}
        />
        {childrenLength > 0 && (
          <AttributeExpandBtn expanded={expanded} handleExpand={handleExpand} />
        )}
      </div>
      {childrenLength > 0 && (
        <CategoryList
          categoryTree={categoryData.children}
          updateFilters={updateFilters}
          expanded={expanded}
          showFacetCount={showFacetCount}
        />
      )}
    </li>
  )
}
