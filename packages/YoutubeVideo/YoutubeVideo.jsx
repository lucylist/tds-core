import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import YouTube from 'react-youtube'

import VideoSplash from '../../shared/components/VideoSplash/VideoSplash'

import safeRest from '../../shared/utils/safeRest'

import styles from './YoutubeVideo.modules.scss'

/**
 * @version ./package.json
 */
const YoutubeVideo = ({ videoId, aspectRatio, defaultVolume, beginMuted, ...rest }) => {
  const [started, setStarted] = useState(false)

  const initializeYoutubePlayer = event => {
    event.target.setVolume(defaultVolume * 100)
    beginMuted && event.target.mute()
  }

  const StyledPlayerContainer = styled.div({
    width: '100%',
    outline: 'none',
  })

  const aspectRatios = {
    '16:9': { paddingTop: '56.25%' },
    '4:3': { paddingTop: '75%' },
    '1:1': { paddingTop: '100%' },
  }

  const AspectLimiter = styled.div({ ...aspectRatios[aspectRatio], position: 'relative' })

  const StyledYoutubePlayer = styled(YouTube)({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  })

  return (
    <StyledPlayerContainer id="videoPlayerContainer" {...safeRest(rest)}>
      <AspectLimiter>
        {started ? (
          <StyledYoutubePlayer
            videoId={videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
              },
            }}
            onReady={initializeYoutubePlayer}
            id="youtubeVideoPlayer"
          />
        ) : (
          <VideoSplash
            poster={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            onClick={() => {
              setStarted(true)
            }}
          />
        )}
      </AspectLimiter>
    </StyledPlayerContainer>
  )
}

YoutubeVideo.propTypes = {
  videoId: PropTypes.string.isRequired,
  aspectRatio: PropTypes.oneOf(['16:9', '4:3', '1:1']),
  defaultVolume: PropTypes.number,
  beginMuted: PropTypes.bool,
}

YoutubeVideo.defaultProps = {
  videoId: undefined,
  aspectRatio: '16:9',
  defaultVolume: 1,
  beginMuted: false,
}

export default YoutubeVideo
