export const FILTERABLE_FACET_TYPES = {
  tree: 'tree',
  price: 'price',
  list: 'list',
} as const
export type FilterableFacetTypes =
  (typeof FILTERABLE_FACET_TYPES)[keyof typeof FILTERABLE_FACET_TYPES]

export interface FilterableFacetType {
  __editorItemTitle?: string
  key: string
  type: FilterableFacetTypes
  title: string
}
