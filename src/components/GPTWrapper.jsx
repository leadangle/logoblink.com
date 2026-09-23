import React from 'react'

import AD, {
  Horizontal as AD_Horizontal,
  Mobile as AD_Mobile,
} from 'react-google-publisher-tag'

import screens from 'styles/tailwind-screens'
import { Location } from '@reach/router'
import { lifecycle, withHandlers, fromRenderProps, compose } from 'recompose'

const GPT_NETWORK = process.env.GATSBY_GPT_NETWORK_CODE

const enhanceWithLocationProp = fromRenderProps(Location, ({ location }) => ({
  location,
}))

const enhanceWithGPTSlotRefreshHandler = withHandlers(() => {
  let gtpSlot

  return {
    onRef: () => ref => {
      gtpSlot = ref
    },
    refresh: () => () => {
      gtpSlot && gtpSlot.refreshSlot()
    },
  }
})

const enhanceWithLocationPropUpdateHandler = lifecycle({
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.refresh && this.props.refresh()
    }
  },
})

const enhanceGPT = compose(
  enhanceWithLocationProp,
  enhanceWithGPTSlotRefreshHandler,
  enhanceWithLocationPropUpdateHandler
)

export default enhanceGPT(({ path, onRef, ...props }) => {
  return GPT_NETWORK ? (
    <AD ref={onRef} path={`${GPT_NETWORK}/${path}`} {...props} />
  ) : null
})

export const Horizontal = enhanceGPT(({ path, onRef, ...props }) => {
  return GPT_NETWORK ? (
    <AD_Horizontal ref={onRef} path={`${GPT_NETWORK}/${path}`} {...props} />
  ) : null
})

export const SmartMobile = enhanceGPT(({ path, onRef, ...props }) => {
  return GPT_NETWORK ? (
    <AD_Mobile
      ref={onRef}
      path={`${GPT_NETWORK}/${path}`}
      {...props}
      mobileMaxWindowWidth={parseInt(screens.xs.max, 10)}
    />
  ) : null
})
