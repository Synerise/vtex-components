import React from 'react'

import { FILTERABLE_FACET_TYPES } from '../types/FilterTypes'
import type { FilterableFacetType } from '../types/FilterTypes'
import { ListingContextProvider } from '../context'
import { ListingSection } from './ListingSection'

export type FacetType = Record<string, Record<string, number>>

const DEFAULT_FILTERS: FilterableFacetType[] = [
  {
    __editorItemTitle: 'Category',
    key: 'category',
    title: 'Category',
    type: FILTERABLE_FACET_TYPES.tree,
  },
  {
    __editorItemTitle: 'Range',
    key: 'salePrice.value',
    title: 'Price',
    type: FILTERABLE_FACET_TYPES.range,
  },
  {
    __editorItemTitle: 'Brand',
    key: 'brand',
    title: 'Brand',
    type: FILTERABLE_FACET_TYPES.list,
  },
]

interface ListingProps {
  indexId: string
  personalize: boolean
  sortByMetric: 'TransactionsPopularity' | 'PageVisitsPopularity'
  listingFilterAttribute: string
  filterableFacets: FilterableFacetType[]
  showFacetsValue: boolean
  facetsSize: number
  maxValuesPerFacet: number
  distinctFilter: {
    attribute: string
    maxNumItems: number
    levelRangeModifier: number
  }
  ignoreQueryRules: boolean
}

export function Listing(props: ListingProps) {
  return (
    <ListingContextProvider
      contextFilterAttribute={props.listingFilterAttribute}
    >
      <ListingSection {...props} />
    </ListingContextProvider>
  )
}

Listing.defaultProps = {
  listingFilterAttribute: 'category',
  filterableFacets: DEFAULT_FILTERS,
  showFacetsValue: true,
}

Listing.schema = {
  title: 'Synerise listing and search results',
  description: 'Listing and search results component for Synerise AI Search',
  type: 'object',
  properties: {
    indexId: {
      title: 'Index ID',
      description: 'ID of the index to be used in the search operation',
      type: 'string',
    },
    personalize: {
      title: 'Personalize',
      description: 'If set to false, the search result is not personalized.',
      type: 'boolean',
      default: true,
    },
    sortByMetric: {
      title: 'Sort by metric',
      description: 'Name of the metric by which the data will be sorted.',
      type: 'string',
      enum: ['TransactionsPopularity', 'PageVisitsPopularity'],
    },
    listingFilterAttribute: {
      title: 'Listing Filter Attribute',
      description:
        'Defines which attribute should be automatically filtered based on the URL path (e.g. if set to category, path /shoes sets default filter to category=shoes). Common values: category, brand, etc.',
      type: 'string',
      default: 'category',
    },
    filterableFacets: {
      title: 'Filters',
      type: 'array',
      items: {
        type: 'object',
        title: 'Filter',
        properties: {
          __editorItemTitle: {
            title: 'Item name',
            default: 'Filter item',
            type: 'string',
          },
          title: {
            title: 'Title',
            type: 'string',
          },
          key: {
            title: 'Key',
            type: 'string',
            description: 'Catalog key of the filter.',
          },
          type: {
            title: 'Type',
            type: 'string',
            enum: ['list', 'tree', 'range'],
            description: 'Type of the filter to be applied.',
          },
        },
      },
      default: DEFAULT_FILTERS,
    },
    showFacetsValue: {
      title: 'Show facets value',
      description:
        'If true number of items for each facet will be shown. If false, only the name of the facet will be shown.',
      type: 'boolean',
      default: true,
    },
    facetsSize: {
      title: 'Facets size',
      description:
        'Determines how many items will be used for facets aggregation. [1-10000]',
      type: 'number',
      default: 2000,
    },
    maxValuesPerFacet: {
      title: 'Max values per facet',
      description:
        'Determines how many values will be retrieved per facet. [1-1000]',
      type: 'number',
      default: 50,
    },
    distinctFilter: {
      type: 'object',
      title: 'Distinct filter',
      description:
        'Distinct filters regulate how many items with the same value of a particular attribute can be returned.',
      properties: {
        attribute: {
          type: 'string',
          title: 'Attribute',
          description: 'Name of the attribute to be used for distinct filter.',
        },
        maxNumItems: {
          type: 'number',
          title: 'Max number of items',
          description:
            'Maximum number of items to be returned per each distinct attribute value.',
        },
        levelRangeModifier: {
          type: 'number',
          title: 'Level range modifier',
          description:
            'Level of the category, if the category attribute was used for distinct filter.',
        },
      },
    },
    ignoreQueryRules: {
      title: 'Ignore query rules',
      description: 'If set to true, query rules are not applied.',
      type: 'boolean',
      default: false,
    },
  },
}
