import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import {
  getListingQuery,
  getRecentSearchesQuery,
  getSearchQuery,
} from '../../../graphql/Queries'
import { SuggestionsList } from '.'
import styles from './Suggestions.css'
import { SearchContext } from '../../Search'

interface SearchHintsProps {
  showPopular: boolean
  showRecent: boolean
}

export function SearchHints({ showPopular, showRecent }: SearchHintsProps) {
  const { query: urlQuery } = useRuntime()
  const {
    debouncedQuery: query,
    suggestionsIndexId,
    indexId,
    suggestionsLimit,
    popularSearchesLimit,
    recentSearchesLimit,
  } = useContext(SearchContext)

  const { data: suggestionsData } = useQuery(getSearchQuery, {
    variables: {
      indexId: suggestionsIndexId,
      query,
      limit: suggestionsLimit,
    },
    ssr: false,
    skip: !suggestionsIndexId || !query.length,
  })

  const { data: popularSearchesData } = useQuery(getListingQuery, {
    variables: {
      indexId: suggestionsIndexId,
      limit: popularSearchesLimit,
    },
    ssr: false,
    skip: !suggestionsIndexId || !showPopular,
  })

  const { data: recentSearchesData } = useQuery(getRecentSearchesQuery, {
    variables: {
      indexId,
      clientUUID: SyneriseTC?.uuid,
      windowSize: recentSearchesLimit,
    },
    fetchPolicy: 'cache-and-network',
    ssr: false,
    skip: !showRecent,
  })

  const suggestions = suggestionsData?.syneriseAISearch.autocomplete.data ?? []

  const popularSearches =
    popularSearchesData?.syneriseAISearch.listing.data ?? []

  const recentSearches =
    Array.from(recentSearchesData?.syneriseAISearch.recentSearches) ?? []

  if (urlQuery?.q && !recentSearches.includes(urlQuery.q)) {
    recentSearches.unshift(urlQuery.q)
    recentSearches.length = Math.min(recentSearchesLimit, recentSearches.length)
  }

  if (
    !suggestions.length &&
    !popularSearches.length &&
    !recentSearches.length
  ) {
    return null
  }

  return (
    <div className={styles['search-hints-container']}>
      {suggestions.length > 0 && (
        <SuggestionsList
          items={suggestions}
          variant="wrap"
          heading="Suggested queries"
        />
      )}
      {popularSearches.length > 0 && (
        <SuggestionsList
          heading="Popular searches"
          items={popularSearches}
          variant="wrap"
        />
      )}
      {recentSearches.length > 0 && (
        <SuggestionsList
          heading="Recent searches"
          items={recentSearches.map((el: string) => ({ suggestion: el }))}
        />
      )}
    </div>
  )
}
