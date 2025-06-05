import React, { createContext, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-apollo'

import styles from './SearchStyles.css'
import { SearchBar } from './SearchBar'
import { SearchResults } from './SearchResults'
import { getSearchQuery } from '../graphql/Queries'

export const SearchContext = createContext<{
  query: string
  setQuery: (query: string) => void
  debouncedQuery: string
  setDebouncedQuery: (query: string) => void
  indexId: string
  suggestionsIndexId: string
  correlationId: string
  suggestionsLimit: number
  recentSearchesLimit: number
  popularSearchesLimit: number
}>({
  query: '',
  setQuery: () => {},
  debouncedQuery: '',
  setDebouncedQuery: () => {},
  indexId: '',
  suggestionsIndexId: '',
  correlationId: '',
  suggestionsLimit: 5,
  recentSearchesLimit: 5,
  popularSearchesLimit: 5,
})

interface SearchProps {
  indexId: string
  suggestionsIndexId: string
  recommendations: {
    recommendationIdNoResults: string
    recommendationHeadingNoResults: string
    recommendationIdNoQuery: string
    recommendationHeadingNoQuery: string
  }
  inputDebounceTime: number
  showRecentSearches: boolean
  showPopularSearches: boolean
  suggestionsLimit: number
  recentSearchesLimit: number
  popularSearchesLimit: number
}

export function Search({
  indexId,
  suggestionsIndexId,
  recommendations = {
    recommendationIdNoResults: '',
    recommendationHeadingNoResults:
      'No matches found. You might like these instead:',
    recommendationIdNoQuery: '',
    recommendationHeadingNoQuery: 'Recommended for you',
  },
  inputDebounceTime = 300,
  showRecentSearches = true,
  showPopularSearches = true,
  suggestionsLimit = 5,
  recentSearchesLimit = 5,
  popularSearchesLimit = 5,
}: SearchProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [showResults, setShowResults] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const handleCloseSearch = (e: MouseEvent) => {
    if (!searchContainerRef.current?.contains(e.target as Node)) {
      setShowResults(false)
    }
  }

  useEffect(() => {
    // handle close on click outside search
    document.addEventListener('click', handleCloseSearch, true)

    return () => {
      document.removeEventListener('click', handleCloseSearch, true)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, inputDebounceTime)

    return () => clearTimeout(timeout)
  }, [query, inputDebounceTime])

  const { data, loading } = useQuery(getSearchQuery, {
    variables: {
      indexId,
      query: debouncedQuery,
      limit: 8,
    },
    ssr: false,
    skip: !query.length || !indexId,
  })

  const products = data?.syneriseAISearch.autocomplete.data ?? []
  const correlationId =
    data?.syneriseAISearch.autocomplete.extras.correlationId ?? ''

  if (!indexId) return null

  return (
    <div className={styles['search-container']} ref={searchContainerRef}>
      <SearchContext.Provider
        value={{
          query,
          debouncedQuery,
          setQuery,
          setDebouncedQuery,
          indexId,
          suggestionsIndexId,
          correlationId,
          suggestionsLimit,
          recentSearchesLimit,
          popularSearchesLimit,
        }}
      >
        <SearchBar setFocused={setShowResults} loading={loading} />
        {showResults && (
          <SearchResults
            recommendations={recommendations}
            products={products}
            loading={loading}
            showRecent={showRecentSearches}
            showPopular={showPopularSearches}
          />
        )}
      </SearchContext.Provider>
    </div>
  )
}

Search.schema = {
  title: 'Synerise autocomplete search',
  description:
    'Search component with autocomplete, suggestions, and product recommendations powered by Synerise AI',
  type: 'object',
  properties: {
    indexId: {
      title: 'Index ID',
      description: 'ID of the index to be used in the search operation',
      type: 'string',
    },
    suggestionsIndexId: {
      title: 'Suggestions Index ID',
      description:
        'ID of the suggestions index used for search suggestions and popular searches. Leave empty to disable suggestions',
      type: 'string',
      default: '',
    },
    suggestionsLimit: {
      title: 'Suggestions Limit',
      description: 'Maximum number of search term suggestions to show',
      type: 'number',
      default: 5,
    },
    recommendations: {
      type: 'object',
      properties: {
        recommendationIdNoResults: {
          title: 'No Results Recommendation ID',
          description:
            'Campaign ID to fetch alternative product recommendations when search returns no results. Leave empty to disable fallback recommendations',
          type: 'string',
          default: '',
        },
        recommendationHeadingNoResults: {
          title: 'No Results Recommendations Heading',
          description:
            'Heading text displayed above fallback recommendations when search returns no results',
          type: 'string',
          default: 'No matches found. You might like these instead:',
        },
        recommendationIdNoQuery: {
          title: 'Empty Query Recommendation ID',
          description:
            'Campaign ID to fetch default product recommendations when search box is empty. Leave empty to disable initial recommendations',
          type: 'string',
          default: '',
        },
        recommendationHeadingNoQuery: {
          title: 'Empty Query Recommendations Heading',
          description:
            'Heading text displayed above recommendations when search box is empty',
          type: 'string',
          default: 'Recommended for you',
        },
      },
    },
    inputDebounceTime: {
      title: 'Input Debounce Time',
      description:
        'Delay in milliseconds before triggering search after user stops typing. Helps reduce API calls for better performance',
      type: 'number',
      default: 300,
    },
    showRecentSearches: {
      title: 'Show Recent Searches',
      description:
        "Enable/disable the display of user's recent search history in the dropdown",
      type: 'boolean',
      default: true,
    },
    recentSearchesLimit: {
      title: 'Recent Searches Limit',
      description:
        'Maximum number of recent searches to display in the history list',
      type: 'number',
      default: 5,
    },
    showPopularSearches: {
      title: 'Show Popular Searches',
      description:
        'Enable/disable the display of trending/popular search terms in the dropdown',
      type: 'boolean',
      default: true,
    },
    popularSearchesLimit: {
      title: 'Popular Searches Limit',
      description: 'Maximum number of popular/trending search terms to display',
      type: 'number',
      default: 5,
    },
  },
}
