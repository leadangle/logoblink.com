import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Content, { HTMLContent } from '../components/Content'
import Sidebar from 'components/Sidebar'
import Disqus from 'disqus-react'
import { Location } from '@reach/router'
import SocialShare from 'components/SocialShare'
import { Fill } from 'react-slot-fill'
import SEO from 'components/seo'
import rehypeReact from 'rehype-react'
import WithCSS from 'components/WithCSS'

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { 'with-css': WithCSS },
}).Compiler

export const PageTemplate = ({
  id,
  content,
  contentComponent,
  author,
  publishDate,
  publishDateISO,
  title,
  helmet = null,
  pageContext: {
    site: {
      siteMetadata: { disqusBaseUrl, disqusShortname, siteUrl },
    },
  },
}) => {
  const PostContent = contentComponent || Content

  // let postImage = null

  // try {
  //   postImage = nodeFields.featuredImage.childImageSharp.original.src
  // } catch (e) {}

  const disqusParams = {
    identifier: id,
    title: title,
  }

  return (
    <Location>
      {({ location }) => {
        // if (postImage) {
        //   postImage = `${siteUrl}/${postImage}`.replace(/([^:])\/\//, '$1/')
        // }

        const disqusConfig = {
          ...disqusParams,
          url: `${disqusBaseUrl}${location.pathname}`,
        }

        return (
          <>
            {helmet}

            <article className="hentry">
              <header className="lg:-ml-8 lg:pl-8 py-4 border-b mb-4">
                <h1 className="entry-title title mb-0">{title}</h1>

                <div className="post-meta italic text-grey-dark text-xs mb-2 mt-2">
                  by{' '}
                  <span className="author vcard uppercase text-black roman">
                    {author}
                  </span>{' '}
                  on{' '}
                  <time
                    className="entry-date published uppercase text-black roman"
                    dateTime={publishDateISO}
                  >
                    {publishDate}
                  </time>
                </div>
              </header>

              {/* {process.env.GATSBY_ADSENSE_PUB_ID && ( */}
              {/* <GoogleAd468x60 pubID={process.env.GATSBY_ADSENSE_PUB_ID} /> */}
              {/* )} */}
              <PostContent className="entry-content" content={content} />

              {/* {process.env.GATSBY_ADSENSE_PUB_ID && ( */}
              {/* <GoogleAd468x60 pubID={process.env.GATSBY_ADSENSE_PUB_ID} /> */}
              {/* )} */}

              <footer>
                <SocialShare
                  url={location.href}
                  className="list-reset"
                  itemClassName="inline-block"
                  // mediaURL={postImage}
                  size={48}
                />

                <Disqus.DiscussionEmbed
                  shortname={disqusShortname}
                  config={disqusConfig}
                />
              </footer>
            </article>
          </>
        )
      }}
    </Location>
  )
}

PageTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.oneOfType([
    PropTypes.instanceOf(Helmet),
    PropTypes.instanceOf(SEO),
  ]),
  data: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  publishDate: PropTypes.string.isRequired,
  publishDateISO: PropTypes.string.isRequired,
  nodeFields: PropTypes.object,
}

const Page = ({ data, pageContext: { site, settings }, ...props }) => {
  const { markdownRemark: post } = data

  const {
    siteMetadata: { siteTitle, siteUrl },
  } = site
  const {
    header: {
      yaml: {
        logo: { sharp: logo },
      },
    },
  } = settings

  const { frontmatter, fields } = post
  const metaDescription = frontmatter.description || post.autoDescription

  const permalink = `${siteUrl}${frontmatter.permalink}`
  const { featuredImage } = fields

  // const postImage = featuredImage
  //   ? `${siteUrl}${featuredImage && featuredImage.childImageSharp.original.src}`
  //   : null

  const helmet = (
    <SEO title={post.frontmatter.title} description={metaDescription} />
  )

  return (
    <>
      <PageTemplate
        id={post.id}
        content={renderAst(post.htmlAst)}
        contentComponent={Content}
        description={post.frontmatter.description}
        helmet={helmet}
        author={fields.author}
        publishDate={frontmatter.date}
        publishDateISO={frontmatter.dateSchema}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        nodeFields={post.fields}
        pageData={data}
        pageContext={{ site, settings }}
      />

      <Fill name="Layout.Sidebar">
        <Sidebar />
      </Fill>
    </>
  )
}

Page.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
    site: PropTypes.object,
  }),
}

export default Page

export const MarkdownPageItemFragment = graphql`
  fragment MarkdownPageItem on MarkdownRemark {
    id
    # html
    htmlAst
    autoDescription: excerpt(pruneLength: 160, format: PLAIN)

    fields {
      slug
      author
      featuredImage {
        childImageSharp {
          original {
            src
          }
        }
      }
    }

    frontmatter {
      title
      description
      permalink
      date(formatString: "MMMM DD, YYYY")
      dateSchema: date(formatString: "YYYY-MM-DDTHH:mm:ss.0000000Z")
    }
  }
`

export const pageQuery = graphql`
  query PageByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      ...MarkdownPageItem
    }
  }
`
