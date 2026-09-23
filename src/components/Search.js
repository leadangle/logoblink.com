import React, { Component, forwardRef } from 'react'
import { Link } from 'gatsby'

const {
  Provider: SearchProvider,
  Consumer: SearchConsumer,
} = React.createContext({
  query: '',
  results: [],
  updateContext: () => {},
})
export const getSearchResults = (query, lang = 'en') => {
  if (!query || !window.__LUNR__) return []
  const lunrIndex = window.__LUNR__[lang]
  const results = lunrIndex.index.search(query) // you can  customize your search , see https://lunrjs.com/guides/searching.html
  return results.map(({ ref }) => lunrIndex.store[ref])
}

class SearchForm extends Component {
  lang = 'en'

  minQueryLength = 3

  constructor(props) {
    super(props)
    const { context } = this.props

    this.updateContext = context.updateContext

    this.state = {
      query: context.query,
      results: context.results,
      charsTillSearch: this.minQueryLength,
    }
  }
  maybeSearch = event => {
    const query = event.target.value

    let results = []
    let charsTillSearch = 0

    if (query.length < this.minQueryLength) {
      charsTillSearch = this.minQueryLength - query.length
    } else {
      results = getSearchResults(query)
    }

    this.updateContext({ results, query, charsTillSearch })
  }

  render() {
    const {
      className = '',
      inputClassName = '',
      searchFieldRef = () => {},
      context,
    } = this.props
    const { query } = context

    return (
      <form name="search" className={`${className} relative`}>
        <input
          ref={searchFieldRef}
          type="search"
          className={inputClassName}
          defaultValue={query}
          placeholder="Type to search"
          onInput={this.maybeSearch}
        />
      </form>
    )
  }
}

const SearchFormWithContext = forwardRef((props, ref) => (
  <SearchConsumer>
    {context => {
      return <SearchForm {...props} context={context} ref={ref} />
    }}
  </SearchConsumer>
))

const SearchResultsWithContext = forwardRef((props, ref) => (
  <SearchConsumer>
    {context => {
      const { results } = context
      const { className, linkClassname } = props

      return results.length > 0 ? (
        <div className={className} ref={ref}>
          <ul className="list-reset">
            {results.map(({ url, title }) => (
              <li key={url}>
                <Link
                  to={url}
                  className={linkClassname}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null
    }}
  </SearchConsumer>
))

export {
  SearchProvider,
  SearchConsumer,
  SearchFormWithContext,
  SearchResultsWithContext,
}
