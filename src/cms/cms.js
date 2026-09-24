/* global __PATH_PREFIX__  */

import CMS, { init } from 'netlify-cms'

// import AboutPagePreview from './preview-templates/AboutPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import FileSystemBackend from './FileSystemBackend'
import FigureComponent from './figureComponent'

// import ProductPagePreview from './preview-templates/ProductPagePreview'

// CMS.registerPreviewTemplate('about', AboutPagePreview)
// CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('blog', BlogPostPreview)
CMS.registerEditorComponent(FigureComponent)

/*
const config = {
  backend: {
    name: 'gitlab',
    repo: '',
    auth_type: 'implicit',
    branch: process.env.GATSBY_GIT_BRANCH,
    app_id: process.env.GATSBY_GITLAB_APPID || '',
  },
}*/

const config = {
  backend: {
    name: 'github',
    repo: process.env.GATSBY_GITHUB_REPO,
    branch: process.env.GATSBY_GIT_BRANCH,
  },
}

if (process.env.NODE_ENV === 'development') {
  config.backend = {
    name: 'file-system',
    api_root: `http://localhost:8000${__PATH_PREFIX__}/api`,
  }

  CMS.registerBackend('file-system', FileSystemBackend)
}

init({ config })
