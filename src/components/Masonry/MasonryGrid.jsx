import React from "react"
import styled from "styled-components/macro"
import { NAV_HEIGHT } from "../Carousel/CarouselStyles"
import { useImagesQuery } from "../queries"
import AnimatedImage from "./AnimatedImage"

export const GRID_GAP = 32
export const GRID_SIZE = 16

const MasonryStyles = styled.div`
  width: 100%;
  min-height: calc(100vh - ${NAV_HEIGHT}px);
  .masonry-grid {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: repeat(auto-fill, minmax(${GRID_SIZE}px, 1fr));
    width: auto;
    /* padding-left: ${GRID_GAP}px; */
  }
  .gatsby-image-wrapper {
  }
  .grid-item{
  }
`

export default () => {
  const { imagesDataArr } = useImagesQuery()
  // TODO: filter for only images that have info

  return (
    <MasonryStyles>
      <div className={"masonry-grid"}>
        {imagesDataArr
          .filter(img => Boolean(img.fluid))
          .map(
            (
              {
                id,
                Image,
                caption,
                date,
                moreInfo,
                path,
                price,
                title,
                width,
                height,
                // depth,
                fluid,
              },
              idx
            ) => (
              <div
                className="grid-item"
                style={{
                  gridColumn: `span ${width + GRID_GAP / GRID_SIZE}`,
                  gridRow: `span ${height + GRID_GAP / GRID_SIZE}`, // doesn't work?
                  paddingTop: GRID_GAP,
                }}
              >
                <AnimatedImage
                  key={id}
                  fluid={fluid}
                  widthInches={width}
                  heightInches={height}
                />
              </div>
            )
          )}
      </div>
    </MasonryStyles>
  )
}
