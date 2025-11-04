import React from 'react'

import { FiltersContainer } from './FiltersContainer'
import { AttributeFilter, AttributeList } from './AttributeFilter'
import { CategoryTree } from './CategoryFilter'
import { PriceFilter } from './PriceFilter'
import type { FacetType } from '../Listing'
import { FILTERABLE_FACET_TYPES } from '../../types/FilterTypes'
import type { FilterableFacetType } from '../../types/FilterTypes'
import { useListingContext } from '../../context'

interface FiltersProps {
  facets: FacetType
  filterableFacets: FilterableFacetType[]
  defaultAttribute: string
  showFacetsValue: boolean
}

export function Filters({
  facets,
  filterableFacets,
  defaultAttribute,
  showFacetsValue,
}: FiltersProps) {
  const { defaultFilters } = useListingContext()

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
                  defaultFilter={
                    facet.key === defaultAttribute
                      ? defaultFilters[defaultAttribute]
                      : ''
                  }
                  showFacetCount={showFacetsValue}
                />
              )}
              {facet.type === FILTERABLE_FACET_TYPES.price && (
                <PriceFilter
                  min={Math.floor(facets[facet.key].min)}
                  max={Math.ceil(facets[facet.key].max)}
                  filterKey={facet.key}
                />
              )}
              {facet.type === FILTERABLE_FACET_TYPES.list && (
                <AttributeList
                  filterKey={facet.key}
                  facets={facets[facet.key]}
                  defaultFilter={
                    facet.key === defaultAttribute
                      ? defaultFilters[defaultAttribute]
                      : ''
                  }
                  showFacetCount={showFacetsValue}
                />
              )}
            </AttributeFilter>
          )
      )}
    </FiltersContainer>
  )
}
