const styler = require('stylefire').default
const tween = require('popmotion').tween

// Source: https://plainjs.com/javascript/styles/get-the-position-of-an-element-relative-to-the-document-24/
function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

module.exports = {
  onPreRouteUpdate: ({ location, action }) => {},

  shouldUpdateScroll: ({
    prevRouterProps,
    routerProps,
    getSavedScrollPosition,
  }) => {
    if (prevRouterProps) {
      const {
        location: { pathname: fromPath },
      } = prevRouterProps
      const {
        location: { pathname: toPath },
      } = routerProps

      const pagedPattern = /\/page\/(\d+)\/?$/

      if (pagedPattern.test(fromPath) || pagedPattern.test(toPath)) {
        const fromPathWithoutPage = fromPath.replace(/\/page\/(\d+)\/?$/, '/')
        const toPathWithoutPage = toPath.replace(/\/page\/(\d+)\/?$/, '/')

        if (fromPathWithoutPage === toPathWithoutPage) {
          const viewportStyler = styler(window)
          const scrollY = window.scrollY
          const { top: mainTop } = offset(document.querySelector('#main'))

          if (scrollY > 400) {
            tween({
              from: { scrollTop: scrollY },
              to: { scrollTop: mainTop },
              duration: 400,
            }).start(v => {
              viewportStyler.set(v)
            })
          }

          return false
        }
      }
    }

    return true
  },
}
