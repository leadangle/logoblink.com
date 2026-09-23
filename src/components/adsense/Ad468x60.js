import React from 'react'

export const GoogleAd = ({ pubID }) => {
  const html = {
    __html: pubID
      ? `<script type="text/javascript">
    <!--
    ${process.env.ACTIVE_ENV !== 'production' ? 'google_adtest="on";' : ''}
    google_ad_client="${pubID}";
    google_alternate_color="FFFFFF";
    google_ad_width=468;
    google_ad_height=60;
    google_ad_format="468x60_as";
    google_ad_type="text_image";
    google_ad_channel="";
    google_color_border="FFFFFF";
    google_color_link="FF0000";
    google_color_bg="FFFFFF";
    google_color_text="000000";
    google_color_url="CCCCCC";
    google_ui_features="rc:0";
    //-->
    </script>`
      : '',
  }

  return <div dangerouslySetInnerHTML={html} />
}
