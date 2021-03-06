import React from "react"
import styled from "styled-components/macro"
import { useStaticQuery, graphql } from "gatsby"
import GatsbyImage from "gatsby-image"
import { useImagesQuery } from "../utils/queries"
import { useMediaQuery } from "@material-ui/core"
import { BREAKPOINTS } from "../utils/constants"

const AboutStyles = styled.div`
  margin: 2em 5em 0 48px;
  .imageAndTextWrapper {
    .imageWrapper {
      padding-bottom: 2em;
    }

    @media (min-width: ${BREAKPOINTS.TABLET}px) {
      margin-left: auto;
      width: 66vw;
    }
  }
  .subsectionWrapper {
    margin-top: 4em;
    .subsection-title {
      font-style: italic;
      font-weight: 100;
      margin-bottom: 2rem;
      width: fit-content;
    }
    .title-and-image-and-caption {
      width: 100%;
      @media (min-width: ${BREAKPOINTS.TABLET}px) {
        margin-left: auto;
        width: 66vw;
      }
      .images-and-captions {
        margin-left: auto;
        display: grid;
        grid-gap: 3rem;
        width: 100%;
        .image-and-caption {
          margin-bottom: 1.5em;
          figcaption {
            margin: 0.5em auto 0;
            width: fit-content;
            font-size: 0.75em;
          }
        }
      }
    }
  }
`

const AboutPage = () => {
  const { imagesArr } = useImagesQuery()
  const data = useStaticQuery(graphql`
    query AboutPage {
      markdownRemark(frontmatter: { templateKey: { eq: "about-page" } }) {
        html
        frontmatter {
          title
          Image
        }
      }
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/about-subsection.+/" } }
        sort: { order: ASC, fields: frontmatter___order }
      ) {
        nodes {
          frontmatter {
            about_image_with_subtitle {
              about_subsection_image
              about_subsection_image_subtitle
            }
            text
            order
            title
          }
        }
      }
    }
  `)
  const { frontmatter, html } = data.markdownRemark
  const subsections = data.allMarkdownRemark.nodes

  return (
    <AboutPageTemplate
      html={html}
      frontmatter={frontmatter}
      subsections={subsections}
      imagesArr={imagesArr}
    />
  )
}

export function AboutPageTemplate({
  frontmatter,
  html,
  subsections,
  imagesArr,
}) {
  const profileImage = imagesArr.find(({ relativePath }) => {
    return `images/uploads/${relativePath}` === frontmatter.Image
  })
  const isTabletOrLarger = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET}px)`)

  return (
    <AboutStyles>
      <div className="imageAndTextWrapper">
        <div className="imageWrapper">
          {profileImage && (
            <GatsbyImage fluid={profileImage} alt="Hyeran Lee" />
          )}
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {subsections.map(({ frontmatter: subFrontmatter }, idx) => {
        const { title, about_image_with_subtitle, text } = subFrontmatter

        return (
          <div key={idx} className="subsectionWrapper">
            <div className="title-and-image-and-caption">
              <h3 className="subsection-title">{title}</h3>
              <div
                className="images-and-captions"
                style={{
                  gridTemplateColumns: about_image_with_subtitle
                    .map(_ => "1fr")
                    .join(" "),
                }}
              >
                {about_image_with_subtitle.map(
                  ({
                    about_subsection_image,
                    about_subsection_image_subtitle,
                  }) => {
                    const image = imagesArr.find(({ relativePath }) => {
                      return (
                        `images/uploads/${relativePath}` ===
                        about_subsection_image
                      )
                    })
                    const hasNoTitle = !title
                    return (
                      <div
                        className="image-and-caption"
                        key={about_subsection_image}
                        style={
                          hasNoTitle
                            ? {
                                width: "75%",
                                ...(isTabletOrLarger
                                  ? { marginLeft: "auto" }
                                  : { margin: "auto" }),
                              }
                            : {}
                        }
                      >
                        {image && (
                          <GatsbyImage
                            fluid={image}
                            alt={about_subsection_image_subtitle}
                          />
                        )}
                        <figcaption>
                          {about_subsection_image_subtitle}
                        </figcaption>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
            {/* <Image fluid={} */}
            <p className="subsection-text">{text}</p>
          </div>
        )
      })}
    </AboutStyles>
  )
}

export default AboutPage
