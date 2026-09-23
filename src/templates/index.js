import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// import Layout from '../components/Layout'
import Sidebar from 'components/Sidebar'
import PostsArchive from 'components/PostsArchive'
// import { Location } from '@reach/router'
import Helmet from 'react-helmet'
import HomePageSlider from 'components/Slider'
// import { GatsbyImageSharpFixed_tracedSVG } from 'gatsby-transformer-sharp'
// import { SlotsInside }  from "components/LayoutContext"
import { Fill } from 'react-slot-fill'
import SEO from 'components/seo'

export default class IndexPage extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { edges: posts = [] } = data.Posts
    const { yaml: { slides } = {} } = data.Slider
    const {
      siteMetadata: { title: siteTitle, description },
    } = pageContext.site

    const { pageNum, numPages } = pageContext

    let titleTag = siteTitle
    if (pageNum > 0) {
      titleTag += ` - Page ${pageNum + 1} of ${numPages}`
    }

    return (
      <>
        <SEO title={titleTag} />
        <Helmet titleTemplate={`%s - ${description}`} />

        <PostsArchive
          title="Latest Entries"
          posts={posts}
          context={pageContext}
        />

        <Fill name="Layout.Sidebar">
          <Sidebar />
        </Fill>

        <Fill name="Layout.AfterNavbar">
          <HomePageSlider slides={slides} />
        </Fill>
      </>
    )
  }
}

export { Sidebar }

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    Posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fields: { contentType: { eq: "posts" } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          ...MarkdownPostArchiveItem
        }
      }
    }

    Slider: file(relativePath: { eq: "slider.yml" }) {
      yaml: childSettingsYaml {
        ...SliderPostItemsFragment
      }
    }
  }
`
