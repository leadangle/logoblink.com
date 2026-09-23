import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Swiper from 'react-id-swiper'
import 'react-id-swiper/src/styles/css/swiper.css'
import { PostBlock } from 'components/PostsArchive'

export const sliderPostItemsFragment = graphql`
  fragment SliderPostItemsFragment on SettingsYaml {
    slides {
      post {
        id
        fields {
          featuredImage {
            sharp: childImageSharp {
              fixed(width: 800, height: 340, cropFocus: CENTER, quality: 80) {
                ...GatsbyImageSharpFixed_withWebp
              }

              squared: fluid(
                maxWidth: 414
                maxHeight: 414
                cropFocus: CENTER
                quality: 80
              ) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          slug
          author
        }
        excerpt(pruneLength: 270)
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          publishDate: date(formatString: "MMMM DD, YYYY")
          publishDateISO: date(formatString: "YYYY-MM-DDTHH:mm:ss.0000000Z")
        }
      }
    }
  }
`

class SliderComponent extends React.Component {
  componentDidMount() {}

  render() {
    const { slides } = this.props
    const options = {}

    return (
      <div className="bg-yellow intro-slider mb-4">
        <Swiper {...options}>
          {slides
            .filter(i => i.post)
            .map(({ post }) => {
              const {
                id,
                fields: {
                  slug,
                  featuredImage: {
                    sharp: {
                      fixed: featuredImageFixed,
                      squared: featuredImageSquare,
                    },
                  },
                },
              } = post

              return (
                <div key={id} className="h-auto w-full self-stretch">
                  <div className="flex flex-col lg:flex-row h-full">
                    <Link className="flex flex-grow flex-no-shrink" to={slug}>
                      <Img
                        className="lg:hidden w-full flex-no-shrink"
                        fluid={featuredImageSquare}
                      />
                      <Img
                        className="hidden w-full h-auto self-stretch lg:block"
                        fixed={featuredImageFixed}
                      />
                    </Link>

                    <div className="slide-content flex-no-grow flex-no-shrink px-4 md:px-8 py-4 lg:py-8 lg:w-1/3">
                      <PostBlock post={post} />
                    </div>
                  </div>
                </div>
              )
            })}
        </Swiper>
      </div>
    )
  }
}

export default SliderComponent
