import React from 'react'
// import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import moment from 'moment'
import WidgetPosts from 'components/WidgetPosts'

const daysDiff = date => {
  return Math.abs(moment(date).diff(new Date(), 'days'))
}

const viewsPerDayComponent = ({ post }) => {
  const {
    fields: { views },
    frontmatter: { date },
  } = post

  const age = daysDiff(date)
  const viewsPeriod = age > 365 ? 365 : age
  const viewsPerDay = Math.ceil(views / viewsPeriod)

  return (
    <div className="italic text-grey-darker">{viewsPerDay} views per day</div>
  )
}

const widget = props => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          sort: { fields: [fields___views], order: DESC }
          limit: 10
          filter: {
            fields: { contentType: { eq: "posts" }, views: { ne: null } }
          }
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
            title="Popular Posts"
            posts={posts}
            after-title={viewsPerDayComponent}
            widgetClassname="widget-popular-posts"
          />
        )
      )
    }}
  />
)

export default widget
