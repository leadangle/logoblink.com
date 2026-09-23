import React from 'react'
import * as PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

const ListItem = ({ post, 'after-title': AfterTitle }) => {
  const {
    fields: {
      featuredImage: { childImageSharp: thumbFixed },
      slug,
    },
    frontmatter: { title },
  } = post

  return (
    <li className="mt-4 flex">
      <Link to={slug}>
        {thumbFixed && thumbFixed.fixed && (
          <Img
            className="flex-no-shrink flex-no-grow mr-4"
            fixed={thumbFixed.fixed}
          />
        )}
      </Link>

      <div className="flex-auto">
        <h3 className="text-sm font-normal mb-0">
          <Link
            to={slug}
            className="no-underline hover:underline text-black"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </h3>

        {AfterTitle && <AfterTitle post={post} />}
      </div>
    </li>
  )
}

export default class WidgetPosts extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object),
    'after-title': PropTypes.func,
  }

  render() {
    const { posts } = this.props

    return (
      (posts.length && (
        <ul className="list-reset text-sm">
          {posts.map(({ node: post }) => (
            <ListItem
              post={post}
              key={post.id}
              after-title={this.props['after-title']}
            />
          ))}
        </ul>
      )) ||
      null
    )
  }
}
