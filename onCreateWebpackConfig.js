
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || []
  }
}

const purgeCssConfig = {
  paths: glob
    .sync([
      './src/layouts/**/*.js?(x)',
      './src/templates/**/*.js?(x)',
      './src/components/**/*.js?(x)',
    ])
    .filter(function(f) {
      return !/\/$/.test(f)
    }),

  extractors: [
    {
      // Custom extractor to allow special characters (like ":") in class names
      // See: https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css-with-purgecss
      extractor: TailwindExtractor,
      extensions: ['js', 'jsx'],
    },
  ],
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
  ], // adjust for each project
}

module.exports = config => {
  const {
    getConfig,
    stage,
    // rules,
    // loaders,
    // plugins,
    actions,
  } = config

  if (stage.includes(`build`)) {
    actions.setWebpackConfig({
      plugins: [new PurgeCssPlugin(purgeCssConfig)],
      optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin()],
      },
    })
  }

  // if (stage.includes(`develop`)) {
  // const fileSystemAPIPlugin = require('./dev/fs/fs-express-api');
  // console.debug('config: ', getConfig() )
  // if ()
  // }
}
