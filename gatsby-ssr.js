const React = require('react')
// const Helmet = require('react-helmet')

// note: all should be valid React components and should have key props since it's a array
const faviconComponents = [
  <link key="link-apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />,
  <link key="link-icon" rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />,
  <link key="link-icon" rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />,
  <link key="link-manifest" rel="manifest" href="/site.webmanifest" />,
  <link key="link-mask-icon" rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff0000" />,
  <meta key="meta-msapplication-TileColor" name="msapplication-TileColor" content="#ffffff" />,
  <meta key="meta-theme-color" name="theme-color" content="#ffffff" />,
]


exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  const components = [
    ...faviconComponents
  ]
  
  setHeadComponents(components)
}
