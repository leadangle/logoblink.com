

process.env.BRANCH = process.env.BRANCH || 'master'

// ensures ACTIVE_ENV env var is set.
// this is managed in netlify.toml during deployment
process.env.ACTIVE_ENV = process.env.ACTIVE_ENV || process.env.NODE_ENV

// we need to know deployed git branch at least for the CMS
// process.env.BRANCH is provided by Netlify by default
// not used in development
// Note: GATSBY_ vars are available in browser
process.env.GATSBY_GIT_BRANCH = process.env.BRANCH

require('dotenv').config()

const fileSystemAPIPlugin = require('./dev/fs/fs-express-api')
const moment = require('moment')

const plugins = [
  'gatsby-plugin-resolve-src',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-sass',
  'gatsby-plugin-postcss',
  `gatsby-plugin-styled-components`,
  `gatsby-plugin-layout`,
  
  {
    resolve: `@entr/gatsby-plugin-netlify-cms-paths`,
    options: {
      // Path to your Netlify CMS config file
      cmsConfig: `static/admin/config.yml`,
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/content/posts`,
      name: 'posts',
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/content/pages`,
      name: 'pages',
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/content/categories`,
      name: 'categories',
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/img`,
      name: 'images',
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/static/img`,
      name: 'netlify-uploads',
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/src/settings`,
      // name: 'settings',
    },
  },
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: '@entr/gatsby-plugin-netlify-cms-paths',
          options: {
            // Path to your Netlify CMS config file
            cmsConfig: `static/admin/config.yml`,
          },
        },
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 736,
            withWebp: true,
            quality: 80,
            showCaptions: true,
            wrapperStyle: 'margin-bottom: 1rem;',
          },
        },
        {
          resolve: 'gatsby-remark-embed-video',
          options: {
            width: 736,
            ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
            related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
            noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
          },
        },
        `gatsby-remark-responsive-iframe`,
        'gatsby-remark-copy-linked-files',
        `gatsby-remark-component`,
        {
          resolve: `gatsby-remark-external-links`,
          options: {
            target: `_blank`,
            rel: `noopener nofollow`,
          },
        },
      ],
    },
  },
  'gatsby-transformer-remark-plaintext',
  'gatsby-transformer-yaml',
  'gatsby-plugin-nprogress',
  'gatsby-plugin-catch-links',
  'gatsby-plugin-twitter',
  `gatsby-plugin-svgr`,
  {
    resolve: `gatsby-plugin-purgecss`,
    options: {
      tailwind: true,
      whitelist: [
        'html',
        'body',
        'p',
        'img',
        'quote',
        'code',
        'pre',
        'ul',
        'ol',
        'li',
        'dd',
        'dt',
        'dd',
        'a',
        'svg',
        '.xs:block',
        '.sm-only:block',
        '.md-only:block',
        '.lg-only:block',
        '.xl:block',
      ],
      whitelistPatterns: [
        /body/,
        /headroom/,
        /ReactModal/,
        /ril/,
        /token/,
        /swiper-/,
        /wp-polls/,
        /pollbar/,
        /gatsby-resp-image/,
      ], // adjust for each project
    },
  },
  {
    resolve: 'gatsby-plugin-netlify-cms',
    options: {
      manualInit: true,
      modulePath: `${__dirname}/src/cms/cms.js`,
      enableIdentityWidget: false,
    },
  },
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      output: '/sitemap.xml',
      query: `
      {
        site {
          siteMetadata {
            siteUrl
          }
        }

        allSitePage {
          edges {
            node {
              path
            }
          }
        }
      }`,
    },
  },
  {
    resolve: `gatsby-plugin-node-fields`,
    options: {
      descriptors: [
        {
          predicate: node => node.internal.type === `MarkdownRemark`,
          fields: [
            {
              name: 'featuredImage',
              getter: node => node.frontmatter.image || ( node.frontmatter['post-img'] && node.frontmatter['post-img'][0] ) || undefined,
              defaultValue: '../../img/placehold-logoblink.png',
            },
            {
              name: 'author',
              getter: node => node.frontmatter.author,
              defaultValue: 'Margarit Ralev',
            },
          ],
        },
      ],
    },
  },
  {
    resolve: 'gatsby-plugin-robots-txt',
    options: {
      resolveEnv: () => process.env.ACTIVE_ENV,
      env: {
        staging: {
          policy: [{ userAgent: '*', disallow: '/' }],
        },
        production: {
          policy: [{ userAgent: '*', disallow: '/admin/' }],
        },
      },
    },
  },
  {
    resolve: `gatsby-plugin-lunr`,
    options: {
      languages: [
        {
          name: 'en',
          filterNodes: node => !!(node.fields && node.fields.contentType === 'posts'),
        }
      ],
      fields: [
        { name: 'title', store: true, attributes: { boost: 20 } },
        { name: 'content' },
        { name: 'url', store: true },
      ],
      resolvers: {
        MarkdownRemark: {
          title: node => node.frontmatter.title,
          content: node => node.rawMarkdownBody,
          url: node => node.fields.slug,
        },
      },
    }
  },
  {
    resolve: `gatsby-plugin-netlify-cache`,
    options: {
      cachePublic: true,
    }
  },
]

if (
  process.env.GA_REPORTING_EMAIL &&
  process.env.GA_REPORTING_PRIVATE_KEY &&
  process.env.GA_REPORTING_VIEW_ID
) {
  plugins.push({
    resolve: `gatsby-source-google-analytics-reporting-api`,
    options: {
      email: process.env.GA_REPORTING_EMAIL,
      key: Buffer.from(process.env.GA_REPORTING_PRIVATE_KEY, 'base64').toString(
        'ascii'
      ),
      viewId: process.env.GA_REPORTING_VIEW_ID,
      startDate: moment()
        .subtract(1, 'year')
        .format('YYYY-MM-DD'),
    },
  })
}

if ( process.env.ACTIVE_ENV === 'production' && process.env.GA_TRACKING_ID ) {
  plugins.push({
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: [
        process.env.GA_TRACKING_ID, // Google Analytics / GA
      ],
      gtagConfig: {
        anonymize_ip: true,
      },
      pluginConfig: {
        respectDNT: true,
      },
    },
  })
}

if (process.env.NODE_ENV === 'production') {
  // production only plugins
  // plugins.push()
}

// make sure to keep netlify last in the array
plugins.push('gatsby-plugin-netlify')

const siteMetadata = {
  title: 'Logoblink.com',
  description: 'about logo, brand and company design',
  author: '@logoblink',
  siteUrl: process.env.URL,
}

if (process.env.DISQUS_SHORTNAME) {
  siteMetadata.disqusShortname = process.env.DISQUS_SHORTNAME
}

if (process.env.DISQUS_BASEURL) {
  siteMetadata.disqusBaseUrl = process.env.DISQUS_BASEURL
}

module.exports = {
  siteMetadata,

  developMiddleware: app => {
    fileSystemAPIPlugin(app)
  },

  plugins,

  mapping: {
    'MarkdownRemark.fields.categories': 'MarkdownRemark.frontmatter.slug',
    'MarkdownRemark.frontmatter.parent': 'MarkdownRemark.frontmatter.slug',
    'SettingsYaml.navigation.category': 'MarkdownRemark.frontmatter.slug',
    'SettingsYaml.slides.post': 'MarkdownRemark.frontmatter.permalink',
    'SettingsYaml.page_nav.path': 'MarkdownRemark.frontmatter.permalink',
    // 'SitePage.parent': 'MarkdownRemark',
  },
}
