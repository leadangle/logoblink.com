import React from 'react'
import {
  FacebookShareButton,
  FacebookIcon,
  // GooglePlusShareButton,
  // GooglePlusIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  // TelegramShareButton,
  // WhatsappShareButton,
  PinterestShareButton,
  PinterestIcon,
  // VKShareButton,
  // OKShareButton,
  RedditShareButton,
  RedditIcon,
  // TumblrShareButton,
  // LivejournalShareButton,
  // MailruShareButton,
  // MailruIcon,
  // ViberShareButton,
  // WorkplaceShareButton,
  EmailShareButton,
  EmailIcon,
} from 'react-share'

export default class SocialShare extends React.Component {
  constructor(props) {
    super(props)
    const { url, round, iconBgStyle, size } = props

    this.state = { url, round, iconBgStyle, size }
  }

  render() {
    const { className, style, itemClassName, mediaURL = '' } = this.props
    const atts = {
      className: `${className} list-social-share mt-4 lg:mt-8`,
      style,
    }
    const { url, size, round, iconBgStyle } = this.state
    const iconProps = { size, round, iconBgStyle }

    return (
      <ul {...atts}>
        <li className={itemClassName}>
          <FacebookShareButton url={url}>
            <FacebookIcon {...iconProps} />
          </FacebookShareButton>
        </li>

        <li className={itemClassName}>
          <TwitterShareButton url={url}>
            <TwitterIcon {...iconProps} />
          </TwitterShareButton>
        </li>

        <li className={itemClassName}>
          <LinkedinShareButton url={url}>
            <LinkedinIcon {...iconProps} />
          </LinkedinShareButton>
        </li>

        <li className={itemClassName}>
          <PinterestShareButton url={url} media={mediaURL}>
            <PinterestIcon {...iconProps} />
          </PinterestShareButton>
        </li>

        <li className={itemClassName}>
          <RedditShareButton url={url}>
            <RedditIcon {...iconProps} />
          </RedditShareButton>
        </li>

        <li className={itemClassName}>
          <EmailShareButton url={url}>
            <EmailIcon {...iconProps} />
          </EmailShareButton>
        </li>
      </ul>
    )
  }
}
