interface SearchResultType {
  name: string
  brand: string
  category: string
  image: string
  price: string
  productUrl: string
  itemId: string
  __typename: string
}

export interface SearchDataType {
  search: SearchResultType[]
}
