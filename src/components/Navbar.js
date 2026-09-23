import React, { forwardRef } from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import { Match } from '@reach/router'
import Img from 'gatsby-image'
import posed from 'react-pose'
import styled from 'styled-components'
import screens from 'styles/tailwind-screens'
import { zIndex } from 'styles/tailwind'
import Headroom from 'react-headroom'
import { IoIosSearch, IoMdCloseCircleOutline } from 'react-icons/io'
import {
  SearchConsumer,
  SearchFormWithContext as SearchForm,
  SearchResultsWithContext as SearchResults,
} from 'components/Search'

import { Location } from '@reach/router'
import { enhanceWithBreakpoints } from 'components/MediaMatch'

const MenuNav = posed.nav({
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

const NavItemList = forwardRef(({
  items,
  linkClassname = '',
  className = null,
}, ref) => {
  if (!items) {
    return null
  }

  return (
    <ul className={className} ref={ref}>
      {items.map((navItem, idx) => {
        const {
          category: {
            fields: { postCount },
            frontmatter: { slug },
          },
          label,
        } = navItem

        if (postCount === 0) {
          return null
        }

        const itemClasses = []

        if (idx === 0) {
          itemClasses.push(`first `)
        }

        if (idx + 1 === items.length) {
          itemClasses.push(`last`)
        }

        const to = `/${slug}/`

        return (
          <Match key={slug} path={to}>
            {({ match }) => {
              match && itemClasses.push(`active`)

              return (
                <li
                  className={`flex-grow lg:flex-no-grow border-l ${itemClasses.join(
                    ` `
                  )}`}
                >
                  <Link className={linkClassname} to={to}>
                    {label}
                  </Link>
                </li>
              )
            }}
          </Match>
        )
      })}
    </ul>
  )
})

const MobileNavItemList = posed(NavItemList)({
  change: {
    applyAtEnd: {
      height: ({ element: { offsetHeight: height } }) => height,
    },
    height: 'auto',
  },
})

const NavMenu = ({
  items,
  className,
  navClassName = ``,
  navListClassname = ``,
}) => {
  return (
    <div className={`items-center justify-center ${className}`}>
      <nav className={`navbar-nav ${navClassName}`}>
        <NavItemList
          items={items}
          className={`list-reset flex flex-row items-center ${navListClassname}`}
          linkClassname="block px-3 pt-4 pb-0 text-center no-underline"
        />
      </nav>
    </div>
  )
}

const mobileSearchInput = React.createRef()

const FlexSearchResultsWrapper = styled(
  posed.div({
    change: {
      applyAtEnd: {
        height: ({ element: { offsetHeight: height } }) => height,
      },
      height: 'auto',
    },
  })
)`
  overflow: auto;
`

const MobileNavMenu = forwardRef( ({
  items,
  className,
  navClassName,
  backdropOnClick,
}, ref) => (
  <div
    ref={ref}
    className={`backdrop fixed flex-col pin max-h-screen items-center justify-center ${className}`}
    onClick={backdropOnClick}
  >
    <MenuNav
      className={`${navClassName}`}
      style={{ maxWidth: 'calc(100% - 4rem)' }}
      onClick={
        // prevent click inside the nav to close the menu
        e => {
          e.stopPropagation()
        }
      }
    >
      <div className="flex flex-row flex-no-shrink flex-no-grow items-center bg-grey-light p-2">
        <IoIosSearch className="w-6 h-6" />
        <SearchForm
          className="flex-grow block"
          inputClassName="w-full bg-transparent border-transparent px-2"
          searchFieldRef={mobileSearchInput}
        />
        <SearchConsumer>
          {({ results, updateContext }) =>
            (results.length && (
              <button
                onClick={() => {
                  updateContext({ query: '', results: [] })
                }}
                className="p-1"
              >
                <IoMdCloseCircleOutline className="inline-block align-middle w-6 h-6" />
              </button>
            )) ||
            null
          }
        </SearchConsumer>
      </div>

      <SearchConsumer>
        {search => (
          <>
            <FlexSearchResultsWrapper
              pose="change"
              poseKey={search.results.length}
              withParent={false}
              className="flex-grow"
            >
              <SearchResults linkClassname="block border-t p-3 no-underline" />
            </FlexSearchResultsWrapper>

            <MobileNavItemList
              pose={search.results.length > 0 ? 'collapsed' : 'expanded'}
              items={search.results.length > 0 ? [] : items}
              className="list-reset"
              linkClassname="block px-2 py-3 uppercase text-center border-t no-underline"
            />
          </>
        )}
      </SearchConsumer>
    </MenuNav>
  </div>
) )

const MobileNavMenuPosed = posed(styled(MobileNavMenu)`
  display: none;
  z-index: 100;
`)({
  open: {
    applyAtStart: { display: 'flex' },
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  closed: {
    applyAtEnd: { display: 'none' },
    backgroundColor: 'rgba(0,0,0,0)',
  },
})

const TogglerBar = forwardRef((props, ref) => (
  <span ref={ref} className="block my-1 w-full h-1 bg-black rounded-sm" />
))

const barPoseTransition = {
  originX: 0,
  originY: '50%',
}

const Bar1 = posed(TogglerBar)({
  open: {
    x: '3px',
    y: '-0.2rem',
    rotate: '45deg',
    ...barPoseTransition,
  },
  closed: {
    x: 0,
    y: 0,
    rotate: '0deg',
    ...barPoseTransition,
  },
})

const Bar2 = posed(TogglerBar)({
  open: {
    rotateY: '-90deg',
    opacity: 0,
  },
  closed: {
    rotateY: '0deg',
    opacity: 1,
  },
})

const Bar3 = posed(TogglerBar)({
  open: {
    x: '3px',
    y: '0.2rem',
    rotate: '-45deg',
    ...barPoseTransition,
  },
  closed: {
    x: 0,
    y: 0,
    rotate: '0deg',
    ...barPoseTransition,
  },
})

const MenuToggler = forwardRef(({ onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className="menu-toggler lg:hidden px-2 w-12 h-12 absolute pin-r pin-t mt-2 mr-2 md:mt-6 md:mr-4 inline-block focus:outline-none"
  >
    <Bar1 />
    <Bar2 />
    <Bar3 />
  </button>
))

const MenuTogglerPosed = posed(MenuToggler)()

const LogoImg = ({ ImageSharp, className }) => (
  <Img
    fixed={ImageSharp.fixed}
    className={className}
    imgStyle={{
      objectFit: 'contain',
    }}
  />
)

const Logo = styled(LogoImg)`
  @media (max-width: ${screens.sm}) {
    max-width: 10rem;
  }
`

class NavBarBase extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mobileNavOpen: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.state.mobileNavOpen) {
        this.toggleMobileMenu && this.toggleMobileMenu()
      }
    }
  }

  toggleMobileMenu = () => {
    if (this.state.posing) {
      return
    }
    this.setState(state => ({
      // ...state,
      posing: true,
    }))

    this.setState(state => {
      return {
        // ...state,
        mobileNavOpen: !state.mobileNavOpen,
      }
    })
  }

  handlePoseCompletion = () => {
    this.setState(state => {
      return { posing: false }
    })
  }

  scrollHandler = () => {}

  componentDidMount = () => {}

  componentWillUnmount = () => {}

  render() {
    const {
      header: {
        yaml: { logo, navigation, page_nav },
      },
      location,
      isMinMd,
    } = this.props

    const { mobileNavOpen } = this.state

    const menuPose = mobileNavOpen ? 'open' : 'closed'

    return (
      <div className="navbar-wrapper lg:mb-2">
        <Headroom
          style={{
            zIndex: zIndex.top,
          }}
          disableInlineStyles={true}
          disable={mobileNavOpen || isMinMd}
        >
          <div className="navbar relative h-14 md:h-auto bg-white border-b lg:border-b-0">
            <div className="flex justify-between items-center">
              <div className="navbar-brand h-16 md:h-24 lg:h-32">
                <Link to="/" className="navbar-item">
                  <Logo
                    ImageSharp={logo.sharp}
                    className="my-auto max-h-full sm:mx-auto block"
                  />
                </Link>
              </div>

              <div className="header-right hidden lg:flex items-center md:float-right h-full md:mr-8">
                <nav className="md:float-right">
                  <ul className="list-reset mr-8 text-sm uppercase">
                    {page_nav.map(({ label, path }) => (
                      <li key={path.id}>
                        <Link
                          className="no-underline hover:underline text-grey-dark hover:text-black"
                          to={path.frontmatter.permalink}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <SearchForm />
              </div>
            </div>

            {/* Desktop  */}
            <div className="hidden lg:block overflow-hidden">
              {navigation.length && (
                <NavMenu
                  location={location}
                  items={navigation}
                  navListClassname="sm:ml-8"
                  navClassName="list-reset uppercase text-sm font-serif border-t lg:mb-2"
                />
              )}
            </div>

            {/* Mobile navigation and toggler positioner */}
            <MenuTogglerPosed onClick={this.toggleMobileMenu} pose={menuPose} />
          </div>
        </Headroom>

        <div className="lg:hidden">
          {navigation.length && (
            <Location>
              {location => {
                return (
                  <MobileNavMenuPosed
                    initialPose="closed"
                    location={location}
                    pose={menuPose}
                    items={navigation}
                    backdropOnClick={this.toggleMobileMenu}
                    onPoseComplete={this.handlePoseCompletion}
                    navClassName="bg-white flex flex-col mx-8 rounded w-full mt-24 mb-12 overflow-hidden"
                  />
                )
              }}
            </Location>
          )}
        </div>
      </div>
    )
  }
}
const NavBar = enhanceWithBreakpoints(NavBarBase)

const NavbarQuery = () => (
  <StaticQuery
    query={graphql`
      query {
        header: file(relativePath: { eq: "header.yml" }) {
          yaml: childSettingsYaml {
            logo {
              sharp: childImageSharp {
                fixed(width: 290, quality: 75) {
                  ...GatsbyImageSharpFixed_withWebp_noBase64
                }
              }
            }

            navigation {
              category {
                fields {
                  postCount
                }
                frontmatter {
                  title
                  slug
                }
              }
              label
            }

            page_nav {
              path {
                id
                frontmatter {
                  permalink
                }
              }
              label
            }
          }
        }
      }
    `}
    render={data => (
      <Location>
        {location => <NavBar {...data} location={location} />}
      </Location>
    )}
  />
)

export default NavbarQuery
