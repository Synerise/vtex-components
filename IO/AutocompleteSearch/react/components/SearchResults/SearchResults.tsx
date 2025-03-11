import type { SearchDataType } from '../../typings/search'
import { SearchResult } from './SearchResult'
import styles from './SearchResult.module.css'

interface SearchResultsProps {
  data: SearchDataType
}

export function SearchResults({ data }: SearchResultsProps) {
  return (
    <div
      className={`${styles.products__container} flex flex-column absolute top-100 z-9999 overflow-y-auto`}
    >
      {data.search?.map(el => (
        <SearchResult {...el} key={el.itemId} />
      ))}
    </div>
  )
}
