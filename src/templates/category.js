import React from 'react'
// import PropTypes from 'prop-types'
// import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import PostsArchive from 'components/PostsArchive'
import Sidebar from 'components/Sidebar'
import { Fill } from 'react-slot-fill'
import SEO from 'components/seo'
import { Horizontal as GTP_Horizontal } from 'components/GPTWrapper'

export default class CategoryPage extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { edges: posts } = data.Posts
    const {
      frontmatter: { title, description },
    } = data.Category
    const { pageNum, numPages } = pageContext

    let titleTag = title

    if (pageNum > 0) {
      titleTag += ` - Page ${pageNum + 1} of ${numPages}`
    }

    return (
      <>
        <SEO title={titleTag} description={description} />

        <h1 className="cat-title" dangerouslySetInnerHTML={{ __html: title }} />
        {description && (
          <h2
            className="cat-description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <PostsArchive posts={posts} context={pageContext} />

        <Fill name="Layout.AfterNavbar">
          <GTP_Horizontal
            className="dfp-unit"
            path="logoblink_archive_main-before"
          />
        </Fill>

        <Fill name="Layout.Sidebar">
          <Sidebar />
        </Fill>
      </>
    )
  }
}

export const PostsQuery = graphql`
  query CategoryPostsQuery($slug: String, $skip: Int!, $limit: Int!) {
    Posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
      filter: {
        fields: { contentType: { eq: "posts" } }
        frontmatter: { categories: { in: [$slug] } }
      }
    ) {
      edges {
        node {
          ...MarkdownPostArchiveItem
        }
      }
    }

    Category: markdownRemark(
      frontmatter: { slug: { eq: $slug } }
      fields: { contentType: { eq: "categories" } }
    ) {
      frontmatter {
        slug
        title
        description
      }
    }
  }
`
