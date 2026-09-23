import React from 'react'

export default ({ name, children = null }) => {
  if (name) {
    import(/* webpackPrefetch: true */ `styles/${name}.css`)
  }

  return children
}
