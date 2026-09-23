import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import { navigate } from 'gatsby'
import Img from 'gatsby-image'
import ReactPaginate from 'react-paginate'
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io'
import posed from 'react-pose'

const hasFeaturedImage = featuredImage => {
  return featuredImage && featuredImage.sharp && featuredImage.sharp.fixed
}

const PostCategories = ({ cats }) =>
  cats &&
  cats.length > 0 && (
    <div className="categories text-xs mb-2 uppercase">
      {cats
        .map(({ frontmatter: { title, slug } }, idx) => (
          <Link to={`/${slug}/`} key={idx}>
            {title}
          </Link>
        ))
        .reduce((prev, current) => [prev, ' / ', current])}
    </div>
  )

export const PostBlock = ({ post }) => {
  const {
    excerpt,
    fields: { slug, categories, author },
    frontmatter: { title, publishDate, publishDateISO, publishDateTooltip },
  } = post

  return (
    <>
      {categories && <PostCategories cats={categories} />}

      <h2 className="entry-title mb-0">
        <Link
          to={slug}
          className="no-underline"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </h2>

      <div className="post-meta italic text-grey-dark text-xs">
        by{' '}
        <span className="author vcard uppercase text-black roman">
          {author}
        </span>{' '}
        on{' '}
        <time
          className="entry-date published uppercase text-black roman"
          dateTime={publishDateISO}
          title={publishDateTooltip}
        >
          {publishDate}
        </time>
      </div>

      <div className="entry-summary overflow-hidden mt-6">{excerpt}</div>

      <Link
        className="button block mt-2 whitespace-no-wrap font-serif"
        to={slug}
      >
        Keep Reading →
      </Link>
    </>
  )
}

const PostEntry = forwardRef(({
  asTag: WrapperTag = 'div',
  post,
  first,
  last,
  style,
}, ref) => {
  const {
    fields: { slug, featuredImage },
  } = post

  return (
    <WrapperTag
      style={style}
      ref={ref}
      className={`hentry post px-4 sm:px-8 lg:pr-0 pt-8 flex flex-col md:flex-row ${(!last &&
        'border-b') ||
        ''} ${slug.replace(/^\/([^/]+)\/$/, '$1')}`}
      key={post.id}
    >
      {hasFeaturedImage(featuredImage) && (
        <Link className="" to={slug}>
          <div className="md:hidden mb-4">
            <Img fluid={featuredImage.sharp.fluid} />
          </div>
          <div className="hidden md:block">
            <Img fixed={featuredImage.sharp.fixed} className="mb-8 mr-8" />
          </div>
        </Link>
      )}

      <div className="mb-8">
        <PostBlock post={post} />
      </div>
    </WrapperTag>
  )
})

const transition = {
  ease: 'easeOut',
  duration: 200,
}

const PostEntryPosed = posed(PostEntry)({
  enter: {
    opacity: 1,
    y: 0,
    transition,
  },
  exit: {
    opacity: 0,
    y: '50%',
    transition,
  },
})

const PostsPosed = posed.div({
  enter: {
    staggerChildren: 200,
  },
})

const PostsPagination = ({
  pageNum,
  numPages,
  linkHandler,
  className,
  linkClassname,
}) => {
  return (
    <div className={className}>
      <ReactPaginate
        pageRangeDisplayed={4}
        forcePage={pageNum}
        pageCount={numPages}
        onPageChange={linkHandler}
        previousLabel={<IoMdArrowDropleft />}
        nextLabel={<IoMdArrowDropright />}
        containerClassName={`pagination list-reset flex md:justify-center lg:justify-start`}
        previousClassName="previous block flex-no-grow"
        nextClassName="next block flex-no-grow"
        pageClassName="block"
        pageLinkClassName={linkClassname}
        previousLinkClassName={linkClassname}
        nextLinkClassName={linkClassname}
        disabledClassName="disabled hidden"
        activeClassName={`active`}
      />
    </div>
  )
}

export default class PostArchives extends React.Component {
  handlePaginateLink = ({ selected }) => {
    const { basePath = '' } = this.props.context

    const to = basePath + (selected === 0 ? '/' : `/page/${selected + 1}`)
    navigate(to)
  }

  render() {
    const { posts, context, title } = this.props

    const Pagination = (
      <PostsPagination
        {...context}
        linkHandler={this.handlePaginateLink}
        linkClassname="block py-1 px-2 text-center"
        className="bg-grey-lighter p-4 -mx-4 md:-mx-8 lg:p-4 lg:ml-0 lg:-mr-8 pin-t pin-l z-50"
      />
    )

    return (
      <section className="archive-posts">
        {title && (
          <h1
            className={`section-title text-xl -mx-4 sm:-mx-8 px-4 sm:px-8 lg:pr-0`}
          >
            {title}
          </h1>
        )}

        {Pagination}

        {posts.length > 0 && (
          <PostsPosed
            className={`posts -mx-4 sm:-mx-8`}
            pose="enter"
            initialPose="exit"
            poseKey={context.pageNum}
          >
            {posts.map(({ node: post }, idx) => (
              <PostEntryPosed
                asTag="article"
                index={idx}
                post={post}
                first={!idx}
                last={idx === posts.length - 1}
                key={post.id}
              />
            ))}
          </PostsPosed>
        )}

        {Pagination}
      </section>
    )
  }
}

PostArchives.propTypes = {
  posts: PropTypes.array,
  context: PropTypes.object,
  title: PropTypes.string,
}

export const markdownPostArchiveItemFragment = graphql`
  fragment MarkdownPostArchiveItem on MarkdownRemark {
    excerpt(pruneLength: 400)
    id
    fields {
      slug
      author
      featuredImage {
        sharp: childImageSharp {
          fixed(width: 290, height: 290, cropFocus: CENTER, quality: 80) {
            ...GatsbyImageSharpFixed_tracedSVG
          }

          fluid(maxWidth: 414, maxHeight: 414, cropFocus: CENTER, quality: 80) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
      categories {
        frontmatter {
          title
          slug
        }
      }
    }
    frontmatter {
      title
      layout
      publishDate: date(formatString: "MMMM DD, YYYY")
      publishDateTooltip: date(formatString: "MMMM Do YYYY, h:mm:ss a")
      publishDateISO: date(formatString: "YYYY-MM-DDTHH:mm:ss.0000000Z")
    }
  }
`
