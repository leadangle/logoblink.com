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
import { SmartMobile as GPT_SmartMobile } from 'components/GPTWrapper'

export const BlogPostTemplate = ({
  id,
  content,
  contentComponent,
  author,
  publishDate,
  publishDateISO,
  // description,
  tags,
  title,
  helmet = null,
  nodeFields,
  pageContext: {
    site: {
      siteMetadata: { disqusBaseUrl, disqusShortname, siteUrl },
    },
  },
}) => {
  const PostContent = contentComponent || Content

  let postImage = null

  try {
    postImage = nodeFields.featuredImage.sharp.original.src
  } catch (e) {}

  const disqusParams = {
    identifier: id,
    title: title,
  }

  return (
    <Location>
      {({ location }) => {
        if (postImage) {
          postImage = `${siteUrl}/${postImage}`.replace(/([^:])\/\//, '$1/')
        }

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
 
              <GPT_SmartMobile
                className="dfp-unit"
                path="logoblink_article_content-before"
              />

              <PostContent className="entry-content" content={content} />

              <GPT_SmartMobile
                className="dfp-unit"
                path="logoblink_article_content-after"
              />

              <footer>
                <SocialShare
                  url={location.href}
                  className="list-reset"
                  itemClassName="inline-block"
                  mediaURL={postImage}
                  size={48}
                />

                {tags && tags.length ? (
                  <div className="mt-2 lg:mt-4">
                    <h4 className="inline-block align-top mb-2 lg:mb-0">
                      Tags:
                    </h4>
                    <ul className="taglist list-reset inline-block align-top">
                      {tags.map(tag => (
                        <li key={`tag-${tag}`} className="inline-block">
                          <Link to={`/tag/${kebabCase(tag)}/`}>{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Disqus.DiscussionEmbed {...{ shortname: disqusShortname, config: disqusConfig }} />
              </footer>
            </article>
          </>
        )
      }}
    </Location>
  )
}

BlogPostTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.oneOfType([ PropTypes.instanceOf(Helmet), PropTypes.object ]),
  pageData: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  publishDate: PropTypes.string.isRequired,
  publishDateISO: PropTypes.string.isRequired,
  nodeFields: PropTypes.object,
}

const BlogPost = ({ data, pageContext: { site, settings }, ...props }) => {
  const { markdownRemark: post } = data

  const {
    siteMetadata: { title: siteTitle, siteUrl },
  } = site

  const {
    header: {
      yaml: {
        logo: { sharp: { original: logo } },
      },
    },
  } = settings

  const { frontmatter, fields } = post
  const metaDescription = frontmatter.description || post.autoDescription
  const permalink = `${siteUrl}${frontmatter.permalink}`
  const { featuredImage } = fields

  let postImage = null
  
  try {
    postImage = featuredImage.sharp.original.src
  } catch (e) {}

  const { plainText: articleBody } = post

  const JSONLD = {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    author: {
      '@type': 'Person',
      name: fields.author,
    },

    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${logo.src}`,
      },
    },

    wordcount: post.wordCount.words,
    url: permalink,
    datePublished: frontmatter.dateSchema,
    dateCreated: frontmatter.dateSchema,
    dateModified: frontmatter.dateSchema,
    description: frontmatter.description,
    articleBody,
    mainEntityOfPage: permalink,
  }

  if (postImage) {
    JSONLD.image = {
      '@type': 'ImageObject',
      url: postImage,
    }
  }

  const helmet = (
    <SEO title={frontmatter.title} description={metaDescription}>
      <script type="application/ld+json">{JSON.stringify(JSONLD)}</script>
    </SEO>
  )

  return (
    <>
      <BlogPostTemplate
        id={post.id}
        content={post.html}
        contentComponent={HTMLContent}
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

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
    site: PropTypes.object,
  }),
}

export default BlogPost

export const markdownPostItemFragment = graphql`
  fragment MarkdownPostItem on MarkdownRemark {
    id
    html
    plainText
    autoDescription: excerpt(pruneLength: 160, format: PLAIN)
    wordCount {
      words
    }
    fields {
      slug
      author
      featuredImage {
        sharp: childImageSharp {
          original {
            src
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
      description
      permalink
      tags
      date(formatString: "MMMM DD, YYYY")
      dateSchema: date(formatString: "YYYY-MM-DDTHH:mm:ss.0000000Z")
    }
  }
`

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      ...MarkdownPostItem
    }
  }
`
