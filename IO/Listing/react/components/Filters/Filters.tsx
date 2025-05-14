import React from 'react'

import { FiltersContainer } from './FiltersContainer'
import { AttributeFilter, AttributeList } from './AttributeFilter'
import { CategoryTree } from './CategoryFilter'
import { PriceFilter } from './PriceFilter'
import type { FacetType } from '../Listing'
import { FILTERABLE_FACET_TYPES } from '../../types/FilterTypes'
import type { FilterableFacetType } from '../../types/FilterTypes'
import type { FilterType } from './utils'

interface FiltersProps {
  facets: FacetType
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  filterableFacets: FilterableFacetType[]
  defaultAttribute: string
  defaultAttributeFilter: string
}

export function Filters({
  facets,
  setFilters,
  filterableFacets,
  defaultAttribute,
  defaultAttributeFilter,
}: FiltersProps) {
  return (
    <FiltersContainer>
      {filterableFacets.map(
        (facet) =>
          facets[facet.key] && (
            <AttributeFilter
              key={`${facet.title}-${facet.key}`}
              title={facet.title}
            >
              {facet.type === FILTERABLE_FACET_TYPES.tree && (
                <CategoryTree
                  facets={facets[facet.key]}
                  filterKey={facet.key}
                  setFilters={setFilters}
                  defaultFilter={
                    facet.key === defaultAttribute ? defaultAttributeFilter : ''
                  }
                  showFacetCount
                />
              )}
              {facet.type === FILTERABLE_FACET_TYPES.price && (
                <PriceFilter
                  min={Math.floor(facets[facet.key].min)}
                  max={Math.ceil(facets[facet.key].max)}
                  filterKey={facet.key}
                  setFilters={setFilters}
                />
              )}
              {facet.type === FILTERABLE_FACET_TYPES.list && (
                <AttributeList
                  filterKey={facet.key}
                  facets={facets[facet.key]}
                  setFilters={setFilters}
                  defaultFilter={
                    facet.key === defaultAttribute ? defaultAttributeFilter : ''
                  }
                  showFacetCount
                />
              )}
            </AttributeFilter>
          )
      )}
    </FiltersContainer>
  )
}
