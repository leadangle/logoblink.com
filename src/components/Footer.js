import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

const settingsQuery = graphql`
  query {
    Settings: settingsYaml(fields: { name: { eq: "footer" } }) {
      copyright
      credits
    }
  }
`

const SiteFooter = ({ copyright, credits }) => {
  return (
    <footer className="footer flex flex-col lg:flex-row py-8 mx-4">
      <div
        className="copyright text-sm px-4 text-center mb-4 lg:text-left lg:mb-0"
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
      <div
        className="credits text-sm px-4 text-center lg:text-right"
        dangerouslySetInnerHTML={{ __html: credits }}
      />
    </footer>
  )
}

const Footer = () => (
  <StaticQuery
    query={settingsQuery}
    render={data => <SiteFooter {...data.Settings} />}
  />
)

export default Footer
