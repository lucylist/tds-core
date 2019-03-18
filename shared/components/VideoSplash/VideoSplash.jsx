import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Paragraph from '@tds/core-paragraph'

import safeRest from '../../utils/safeRest'

/**
 * @version ./package.json
 */

const VideoSplash = ({ poster, ...rest }) => {
  const SplashBackground = styled.div(props => ({
    backgroundImage: `url(${props.poster})`,
    backgroundSize: 'contain',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }))

  const PlayButton = styled.div({
    width: 200,
    height: 200,
    borderRadius: '50%',
    backgroundColor: 'rgba(42,44,46,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  return (
    <SplashBackground poster={poster} {...safeRest(rest)}>
      <PlayButton>
        <Paragraph align="center" bold invert>
          Watch the video
        </Paragraph>
      </PlayButton>
    </SplashBackground>
  )
}

VideoSplash.propTypes = { poster: PropTypes.string.isRequired }

VideoSplash.defaultProps = {}

export default VideoSplash
