const { createFilePath } = require('gatsby-source-filesystem')

const nodeIdbySlug = {}
const nodesByCategory = {}

module.exports = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  const {
    internal: { type },
  } = node

  const fieldDescriptors = [
    
  ]

  switch (type) {
    case 'MarkdownRemark':
      const parentNode = getNode(node.parent)
      // console.debug('parentNode.sourceInstanceName: ', parentNode.sourceInstanceName)

      createNodeField({
        node,
        name: `contentType`,
        value: parentNode.sourceInstanceName,
      })

      // if (parentNode.sourceInstanceName === 'pages') {
      //   const permalink = createFilePath({ node, getNode })
        
      //   // nodeIdByPermalink[permalink] = node.id
      //   // console.debug('page node.fields: ', node.fields)
      // }

      if ( parentNode.sourceInstanceName && ['posts', 'pages'].includes(parentNode.sourceInstanceName) ) {
        const { permalink } = node.frontmatter
        const slug = permalink || createFilePath({ node, getNode })

        nodeIdbySlug[slug] = node.id

        createNodeField({
          node,
          name: `slug`,
          value: slug,
        })

        if ( parentNode.sourceInstanceName === 'posts') {
          const { categories = [] } = node.frontmatter

          if (categories.length) {
            categories.forEach(slug => {
              nodesByCategory[slug] = nodesByCategory[slug] || []
              nodesByCategory[slug].push(node)
            })
  
            createNodeField({
              node,
              name: 'categories',
              value: categories,
            })
          }
        }
      } else if (parentNode.sourceInstanceName === 'categories') {
        const { slug } = node.frontmatter

        createNodeField({
          node,
          name: 'postCount',
          value: (nodesByCategory[slug] && nodesByCategory[slug].length) || 0,
        })
      }

      break

    case 'PageViews':
      if (node.id in nodeIdbySlug) {
        createNodeField({
          node: getNode(nodeIdbySlug[node.id]),
          name: 'views',
          value: node.totalCount,
        })
      }
      break

    case 'SettingsYaml':
      const parent = getNode(node.parent)

      createNodeField({
        node,
        name: 'name',
        value: parent.name,
      })

      break
  }
}
