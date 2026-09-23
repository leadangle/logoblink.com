const _ = require('lodash')
const path = require('path')


const generateBlogContent = ({ actions, graphql, site, settings }) => {
  const queries = []
  const { createPage } = actions

  const postsQuery = graphql(`
    {
      allMarkdownRemark(
        limit: 1000
        filter: { fields: { contentType: { eq: "posts" } } }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              layout
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    // Create blog-list pages
    const posts = result.data.allMarkdownRemark.edges
    const postsPerPage = 10
    const numPages = Math.ceil(posts.length / postsPerPage)

    Array.from({ length: numPages }).forEach((_, i) => {
      const context = {
        pageNum: i,
        numPages,
        limit: postsPerPage,
        skip: i * postsPerPage,
        site,
        settings,
      }

      createPage({
        path: i === 0 ? '/' : `/page/${i + 1}`,
        component: path.resolve('./src/templates/index.js'),
        context,
      })
    })

    const tags = []

    posts.forEach(edge => {
      const { id, frontmatter, fields } = edge.node
      if ( Array.isArray( frontmatter.tags ) ) {
        tags.push(...frontmatter.tags)
      }

      createPage({
        path: fields.slug,
        component: path.resolve(
          `src/templates/${String(frontmatter.layout)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          site,
          settings,
        },
      })

    })


    // Eliminate duplicate tags
    const postCountByTag = _.countBy(tags)

    // Make tag pages
    _.uniq(tags).forEach(tag => {
      const postsPerPage = 10
      const postCount = postCountByTag[tag]
      const slug = _.kebabCase(tag)

      const numPages = Math.ceil(postCount / postsPerPage)

      Array.from({ length: numPages }).forEach((_, i) => {
        const context = {
          tag,
          pageNum: i,
          numPages,
          limit: postsPerPage,
          skip: i * postsPerPage,
          basePath: `/tag/${slug}`,
          site,
          settings,
        }

        createPage({
          path: `${context.basePath}` + (i === 0 ? '/' : `/page/${i + 1}`),
          component: path.resolve(`src/templates/tags.js`),
          context,
        })
      })
    })
  })

  queries.push(postsQuery)

  catsQuery = graphql(`
    {
      allMarkdownRemark(
        limit: 1000
        filter: { fields: { contentType: { eq: "categories" } } }
      ) {
        edges {
          node {
            fields {
              postCount
            }
            frontmatter {
              title
              slug
              parent {
                frontmatter {
                  slug
                }
              }
              description
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const categories = result.data.allMarkdownRemark.edges

    categories.forEach(({ node }) => {
      const {
        id,
        fields: { postCount },
        frontmatter: {
          slug,
        },
      } = node

      const postsPerPage = 10
      const numPages = Math.ceil(postCount / postsPerPage)

      Array.from({ length: numPages }).forEach((_, i) => {
        const context = {
          slug,
          pageNum: i,
          numPages,
          limit: postsPerPage,
          skip: i * postsPerPage,
          basePath: `/${slug}`,
          site,
          settings,
        }

        createPage({
          path: `/${slug}` + (i === 0 ? '/' : `/page/${i + 1}`),
          component: path.resolve(`src/templates/category.js`),
          context,
        })
      })

    })
  })

  queries.push(catsQuery)

  return Promise.all(queries)
}

const generatePageContent = ({ actions, graphql, site, settings }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(
        limit: 1000
        filter: { fields: { contentType: { eq: "pages" } } }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              layout
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    if ( result.data.allMarkdownRemark ) {
      const pages = result.data.allMarkdownRemark.edges || []

      pages.forEach(edge => {
        const { id, frontmatter, fields } = edge.node
        const { layout } = frontmatter
        
        createPage({
          path: fields.slug,
          component: path.resolve(
            `src/templates/${layout || `page`}.js`
          ),
          // additional data can be passed via context
          context: {
            id,
            site,
            settings
          },
        })
      })
    }
  })
}

module.exports = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      header: file(relativePath: {eq: "header.yml"}) {
        yaml: childSettingsYaml {
          logo {
            sharp: childImageSharp {
              original {
                src
              }
            }
          }
        }
      }

      site {
        siteMetadata {
          title
          description
          siteUrl
          disqusShortname
          disqusBaseUrl
        }
      }
    }
  `).then(result => {
      if (result.errors) {
        result.errors.forEach(e => console.error(e.toString()))
        return Promise.reject(result.errors)
      }

      const { site, header } = result.data

      const blogGenerator = generateBlogContent({ actions, graphql, site, settings: { header } })
      const pageGenerator = generatePageContent({ actions, graphql, site, settings: { header } })

      return Promise.all([blogGenerator, pageGenerator])
  })
}
