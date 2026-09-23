exports.createPages = require('./createPages')

exports.onCreateNode = require('./onCreateNode')

// exports.onCreateWebpackConfig = require('./onCreateWebpackConfig')

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MarkdownRemarkFields {
      views: Int
    }
  `)
}