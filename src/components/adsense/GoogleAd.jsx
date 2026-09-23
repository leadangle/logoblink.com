import React from 'react'

export default ({
  client = process.env.GATSBY_ADSENSE_PUB_ID,
  slot,
  format = 'auto',
  responsive = true,
  className = ``,
}) =>
  client && slot ? (
    <div>
      <ins
        className={`adsbygoogle ${className}`}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? `true` : `false`}
      />
    </div>
  ) : null
