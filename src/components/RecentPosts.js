import React from 'react'
// import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import WidgetPosts from 'components/WidgetPosts'

const widget = props => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 10
          filter: { fields: { contentType: { eq: "posts" } } }
        ) {
          edges {
            node {
              id
              fields {
                views
                slug
                featuredImage {
                  childImageSharp {
                    fixed(width: 40, height: 40, quality: 75) {
                      ...GatsbyImageSharpFixed
                    }
                  }
                }
              }
              frontmatter {
                title
                date
              }
            }
          }
        }
      }
    `}
    render={data => {
      const {
        allMarkdownRemark: { edges: posts },
      } = data

      return (
        posts.length > 0 && (
          <WidgetPosts
            title="Recent posts"
            widgetClassname="widget-recent-posts"
            posts={posts}
          />
        )
      )
    }}
  />
)

export default widget
