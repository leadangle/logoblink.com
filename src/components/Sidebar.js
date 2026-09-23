import React from 'react'
import PopularPostsWidget from 'components/PopularPosts'
import RecentPostsWidget from 'components/RecentPosts'
import GPT from 'components/GPTWrapper'
// import GoogleAd from 'components/adsense/GoogleAd'
// import AD from 'react-google-publisher-tag'

const SidebarWidget = props => {
  const { widgetTitle, widgetClassname, children } = props

  return (
    (children && (
      <div className={`widget widget-posts mb-8 ${widgetClassname}`}>
        <h2 className="section-title text-base px-4 lg:px-0">{widgetTitle}</h2>

        <div className="px-4 lg:px-0">{children}</div>
      </div>
    )) ||
    null
  )
}

const Sidebar = () => {
  return (
    <>
      {/* <GPT
        className="dfp-unit"
        path="logoblink_sidebar-top"
        format="RECTANGLE"
      /> */}

      <SidebarWidget widgetTitle="Recent posts">
        <RecentPostsWidget />
      </SidebarWidget>

      {/* <GPT
        className="dfp-unit"
        path="logoblink_sidebar-middle"
        format="RECTANGLE"
      /> */}

      <SidebarWidget widgetTitle="Popular Posts">
        <PopularPostsWidget />
      </SidebarWidget>
    </>
  )
}

export default Sidebar
