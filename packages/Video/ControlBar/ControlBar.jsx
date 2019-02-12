import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FlexGrid from '@tds/core-flex-grid'

import VideoProgressBar from './Controls/VideoProgressBar/VideoProgressBar'
import VolumeSlider from './Controls/VolumeSlider/VolumeSlider'
import VideoButton from './Controls/VideoButton/VideoButton'

import safeRest from '../../../shared/utils/safeRest'

const ControlBar = ({
  videoPlayer,
  videoPlayerContainer,
  videoPlaying,
  videoBufferEnd,
  hidden,
  videoLength,
  videoCurrentTime,
  videoDefaultVolume,
  videoCurrentVolume,
  videoIsMuted,
  setVolume,
  isMobile,
  tracksAvailable,
  togglePlayPause,
  setSeek,
  toggleMute,
  toggleFullscreen,
  videoIsFullscreen,
  toggleTextTracks,
  resetInactivityTimer,
  setVideoQuality,
  ...rest
}) => {
  const controlBarContainer = {
    width: '100%',
    position: 'relative',
    bottom: 0,
    transition: 'opacity 0.4s',
    opacity: hidden ? 0 : 1,
    display: isMobile ? 'none' : undefined,
  }

  const controlBar = {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: 'green',
    padding: '1rem 0',
  }

  return (
    <div css={controlBarContainer}>
      <div css={controlBar}>
        <FlexGrid limitWidth={false}>
          <FlexGrid.Row verticalAlign="middle">
            <FlexGrid.Col xs={1}>
              <button onClick={togglePlayPause} onFocus={resetInactivityTimer}>
                {videoPlaying ? '\u23F8' : '\u25B6'}
              </button>
            </FlexGrid.Col>
            <FlexGrid.Col xs={3}>
              <VideoProgressBar
                videoPlayer={videoPlayer}
                videoLength={videoLength}
                videoCurrentTime={videoCurrentTime}
                videoBufferEnd={videoBufferEnd}
                setSeek={setSeek}
                resetInactivityTimer={resetInactivityTimer}
              />
            </FlexGrid.Col>
            <FlexGrid.Col xs={3}>
              <VolumeSlider
                videoPlayer={videoPlayer}
                videoDefaultVolume={videoDefaultVolume}
                videoCurrentVolume={videoCurrentVolume}
                setVolume={setVolume}
                resetInactivityTimer={resetInactivityTimer}
              />
            </FlexGrid.Col>
            <FlexGrid.Col xs={1}>
              <button onClick={toggleMute} onFocus={resetInactivityTimer}>
                {videoIsMuted ? '🔇' : '🔈'}
              </button>
            </FlexGrid.Col>
            <FlexGrid.Col xs={1}>
              <button
                type="button"
                data-state="go-fullscreen"
                onClick={toggleFullscreen}
                onFocus={resetInactivityTimer}
              >
                {videoIsFullscreen ? '📱' : '📺'}
              </button>
            </FlexGrid.Col>
            {tracksAvailable && (
              <FlexGrid.Col xs={1}>
                <button
                  id="subtitles"
                  type="button"
                  data-state="subtitles"
                  onClick={toggleTextTracks}
                  onFocus={resetInactivityTimer}
                >
                  💬
                </button>
              </FlexGrid.Col>
            )}
            <FlexGrid.Col xs={2}>
              <select
                name="quality"
                onChange={e => {
                  setVideoQuality(parseInt(e.target.value))
                }}
              >
                <option value="1">1080p</option>
                <option value="2">480p</option>
              </select>
            </FlexGrid.Col>
          </FlexGrid.Row>
        </FlexGrid>
      </div>
    </div>
  )
}

ControlBar.propTypes = {
  videoPlayer: PropTypes.object.isRequired,
  videoPlayerContainer: PropTypes.object.isRequired,
  videoPlaying: PropTypes.bool.isRequired,
  videoBufferEnd: PropTypes.number.isRequired,
  hidden: PropTypes.bool,
  videoLength: PropTypes.number.isRequired,
  videoCurrentTime: PropTypes.number.isRequired,
  videoDefaultVolume: PropTypes.number.isRequired,
  videoCurrentVolume: PropTypes.number.isRequired,
  videoIsMuted: PropTypes.bool.isRequired,
  setVolume: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  tracksAvailable: PropTypes.bool.isRequired,
  togglePlayPause: PropTypes.func.isRequired,
  setSeek: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  videoIsFullscreen: PropTypes.bool.isRequired,
  toggleTextTracks: PropTypes.func.isRequired,
  resetInactivityTimer: PropTypes.func.isRequired,
  setVideoQuality: PropTypes.func.isRequired,
}

ControlBar.defaultProps = {
  hidden: false,
}

export default ControlBar
