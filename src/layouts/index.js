import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Navbar from 'components/Navbar'
import StickyBox from 'react-sticky-box'
import Footer from 'components/Footer'
import {
  SearchProvider,
  SearchResultsWithContext,
  SearchFormWithContext as SearchForm,
} from 'components/Search'

import posed from 'react-pose'
import styled from 'styled-components'
import { IoIosSearch, IoMdCloseCircleOutline } from 'react-icons/io'
import screens from 'styles/tailwind-screens'
import { Slot, Provider as SlotFillProvider } from 'react-slot-fill'
import { enhanceWithBreakpoints } from 'components/MediaMatch'
import 'styles/main.css'
import StickyNotice from '../components/StickyNotice'

// const breakpoints = {
// }

// lg: <div className="hidden lg-only:block" data-breakpoint-name="lg" />,

const SearchWrapper = styled(
  posed.div({
    open: {
      applyAtStart: { display: 'flex' },
      backgroundColor: `rgba(0,0,0,.5)`,
    },
    closed: {
      applyAtEnd: { display: 'none' },
      backgroundColor: `rgba(0,0,0,0)`,
    },
  })
)`
  display: none;

  @media (max-width: ${screens.sm}) {
    display: none !important;
  }
`

const SearchPositioner = posed.div({
  open: {
    applyAtStart: { display: 'flex' },
    opacity: 1,
    scale: 1,
  },
  closed: {
    applyAtEnd: { display: 'none' },
    opacity: 0,
    scale: 0.75,
  },
})

const FlexSearchResultsWrapper = styled(
  posed.div({
    change: {
      // in order to
      applyAtEnd: {
        height: ({ element: { offsetHeight: height } }) => height,
      },
      height: 'auto',
      // width: 'auto',
    },
  })
)`
  overflow: auto;
`
class TemplateWrapperBase extends React.Component {
  static propTypes = {
    sidebar: PropTypes.node,
    afterNavbar: PropTypes.node,
  }

  toggleSearch = (clearQuery = true) => {
    this.setState(({ searchPose, search }) => ({
      searchPose: searchPose === 'open' ? 'closed' : 'open',
      search: {
        ...search,
        query: clearQuery ? '' : search.query,
      },
    }))
  }

  handleKeyPress = ({ key }) => {
    console.debug('key: ', key)
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      searchPose,
      search: { results },
    } = this.state
    const { results: resultsPrev } = prevState.search

    /**
     * Close search on route change
     */
    if (this.props.location !== prevProps.location) {
      if (searchPose === 'open') {
        this.toggleSearch && this.toggleSearch()
      }
    }

    /**
     * Open search panel if on search results update and panel is closed
     */
    if (
      searchPose === 'closed' &&
      results.length > 0 &&
      resultsPrev !== results
    ) {
      this.setState(s => ({
        searchPose: 'open',
      }))
    }
  }

  updateSearchContext = search => {
    this.setState(s => ({ search: { ...s.search, ...search } }))
  }

  constructor(props) {
    super(props)

    const search = {
      results: [],
      query: '',
      updateContext: this.updateSearchContext,
      // getSearchResults,
    }

    this.state = {
      // hasSidebar: 'sidebar' in props,
      // sidebar: props.sidebar,
      afterNavbar: props.afterNavbar,
      searchPose: 'closed',
      resultsPoseProps: {},
      resultsPoseKey: 0,
      mainGridClassname: `lg:w-2/3`,
      mounted: false,
      noticeClosed: false,
      search,
    }

    // this.state.mainGridClassname = 'lg:w-2/3'

    this.resultsRef = React.createRef()
    this.searchInput = React.createRef()
    this.escFunction = this.escFunction.bind(this)
    this.closeNotice = this.closeNotice.bind(this)
  }

  closeNotice() {
    this.setState(() => ({
      noticeClosed: true,
    }))
  }

  escFunction(e) {
    const { searchPose } = this.state
    // console.debug( this.state )

    if (e.keyCode === 27 && searchPose === 'open') {
      e.preventDefault()

      this.toggleSearch()
    }
  }

  searchPoseComplete = pose => {
    if (pose === 'open') {
      if (this.searchInput && this.searchInput.current) {
        this.searchInput.current.focus()
      }
    }

    if (this.searchInput.current) {
      // console.debug('this.searchInput.current: ', this.searchInput.current)
      // console.log( )
      // this.refs.searchInput.getDOMNode().focus();
      // console.debug('this.resultsRef.scrollHeight: ', this.resultsRef.current.scrollHeight)
    }
  }

  updateSearchPoseProps = () => {
    let props = { width: 'auto', height: 0 }

    if (this.resultsRef.current) {
      const height = this.resultsRef.current.offsetHeight
      const width = this.resultsRef.current.offsetWidth
      // const { width, height } = this.resultsRef.current.getBoundingClientRect()
      props = { width, height }
    }

    this.setState(s => {
      return {
        resultsPoseProps: props,
      }
    })

    // if (this.resultsRef.current) {
    // }
  }

  componentDidMount() {
    this.setState(() => ({
      mounted: true,
    }))

    document.addEventListener('keydown', this.escFunction, false)
    // console.debug( 'this.resultsRef', this.resultsRef )
    // const resultsRect = this.resultsRef.current.getBoundingClientRect()

    // this.setState(s => {
    //   // console.debug('this.resultsRef.current: ', this.resultsRsef.current)
    //   return {
    //     resultsPoseProps: resultsRect,
    //   }
    // })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false)
  }

  render() {
    const { children, isMinLg } = this.props
    const { search, searchPose, mounted, noticeClosed } = this.state

    return (
      <SlotFillProvider>
        <SearchProvider value={this.state.search}>
          {(mounted && ! noticeClosed) && (
            <StickyNotice className="bg-green text-white" onClose={this.closeNotice}>
              <a
                className="stretched-link"
                href="https://ralev.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Premium Logo Design Services
              </a>
            </StickyNotice>
          )}

          <div className="wrapper md:py-8">
            <div className="container bg-white">
              <Helmet title="Logoblink.com" />
              <Navbar />

              <Slot name="Layout.AfterNavbar" />

              <div className={`flex flex-col lg:flex-row lg:-px-8 relative`}>
                <main
                  id="main"
                  className={`px-4 sm:px-8 flex-auto ${
                    this.state.mainGridClassname
                  }`}
                >
                  {children}
                </main>
                <div className="sidebar lg:w-1/3 flex-auto lg:px-8">
                  <StickyBox>
                    <div className="">
                      <Slot name="Layout.Sidebar" />
                      {/* {this.state.sidebar} */}
                    </div>
                  </StickyBox>
                </div>
              </div>

              <Footer />

              {/* {search.results} */}
              {isMinLg && (
                <SearchWrapper
                  onPoseComplete={this.searchPoseComplete}
                  pose={searchPose}
                  className="fixed flex-col pin z-top items-center justify-center"
                  onClick={this.toggleSearch}
                >
                  <SearchPositioner
                    onClick={e => {
                      e.stopPropagation()
                    }}
                    className="flex flex-col bg-white rounded my-12 lg:my-24 xl:my-32 w-4/5 lg:w-3/5 overflow-hidden"
                  >
                    <div className="flex flex-row flex-no-shrink items-center bg-grey-light p-2">
                      <IoIosSearch className="w-6 h-6" />
                      <SearchForm
                        className="flex-grow block"
                        inputClassName="w-full bg-transparent border-transparent px-2"
                        searchFieldRef={this.searchInput}
                      />
                      <button className="p-1" onClick={this.toggleSearch}>
                        <IoMdCloseCircleOutline className="inline-block align-middle w-6 h-6" />
                      </button>
                    </div>

                    {/* <SearchResultsWrapper className=""> */}
                    <FlexSearchResultsWrapper
                      pose="change"
                      poseKey={search.results.length}
                      withParent={false}
                      className="flex-grow"
                    >
                      <SearchResultsWithContext
                        ref={this.resultsRef}
                        className=""
                        linkClassname="block no-underline border-t p-3"
                      />
                    </FlexSearchResultsWrapper>

                    {/* </SearchResultsWrapper> */}
                  </SearchPositioner>
                </SearchWrapper>
              )}
            </div>
          </div>
        </SearchProvider>
      </SlotFillProvider>
    )
  }
}

const TemplateWrapper = enhanceWithBreakpoints(TemplateWrapperBase)

export default TemplateWrapper
