import React from 'react'
import { graphql } from 'gatsby'
import PostsArchive from 'components/PostsArchive'
import Sidebar from 'components/Sidebar'
import { Fill } from 'react-slot-fill'
import SEO from 'components/seo'
import { Horizontal as GTP_Horizontal } from 'components/GPTWrapper'

class TagRoute extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { edges: posts } = data.Posts
    const { tag } = pageContext

    const titleTag = `Posts tagged as "${tag}"`
    const heading = `All articles tagged as "${tag}"`

    return (
      <>
        <SEO title={titleTag} />
        <h1
          className="tag-title"
          dangerouslySetInnerHTML={{ __html: heading }}
        />

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

export default TagRoute

export const tagPageQuery = graphql`
  query TagPage($tag: String, $skip: Int!, $limit: Int!) {
    Posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
      filter: {
        fields: { contentType: { eq: "posts" } }
        frontmatter: { tags: { in: [$tag] } }
      }
    ) {
      edges {
        node {
          ...MarkdownPostArchiveItem
        }
      }
    }
  }
`
