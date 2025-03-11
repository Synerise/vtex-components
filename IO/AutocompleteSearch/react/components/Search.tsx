import type { RefObject } from 'react'
import { useRef, useState } from 'react'
import { useLazyQuery } from 'react-apollo'

import searchQuery from '../graphql/Queries/searchQuery.graphql'
import { SearchBox } from './SearchBox/SearchBox'
import { SearchResults } from './SearchResults/SearchResults'
import type { SearchDataType } from '../typings/search'
import { useClickOutside } from '../hooks/useClickOutside'

interface SearchProps {
  index: string
  token: string
}

function Search({ index, token }: SearchProps) {
  const searchQueryRef = useRef<HTMLInputElement>(null)
  const [showResults, setShowResults] = useState(false)

  const [getSearchResults, { data, loading }] = useLazyQuery<SearchDataType>(
    searchQuery,
    {
      variables: {
        query: searchQueryRef.current?.value ?? '',
        index,
        token,
      },
    }
  )

  const onSearchHandler = () => {
    if (searchQueryRef.current?.value) getSearchResults()
  }

  const showResultsHandler = () => {
    setShowResults(true)
  }

  const hideResultsHandler = () => {
    setShowResults(false)
  }

  const searchRef = useClickOutside(
    hideResultsHandler
  ) as RefObject<HTMLDivElement>

  return (
    <div className="ma5 relative" onClick={showResultsHandler} ref={searchRef}>
      <SearchBox searchRef={searchQueryRef} onSearch={onSearchHandler} />
      {loading && <p>Loading...</p>}
      {showResults && data && <SearchResults data={data} />}
    </div>
  )
}

Search.defaultProps = {
  index: 'XXXX',
  token: 'XXX-XXX-XXX',
}

Search.schema = {
  title: 'Search autocomplete component',
  type: 'object',
  properties: {
    index: {
      type: 'string',
      title: 'Search index',
      default: 'XXXX',
    },
    token: {
      type: 'string',
      title: 'Token (tracker key)',
      default: 'XXX-XXX-XXX',
    },
  },
}

export default Search
