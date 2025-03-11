interface SearchResultType {
  title: string
  brand: string
  category: string
  imageLink: string
  price: {
    value: number
    currency: string
  }
  link: string
  itemId: string
}

export interface SearchDataType {
  search: SearchResultType[]
}
