import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FlexGrid from '@tds/core-flex-grid'

import safeRest from '../../../../../shared/utils/safeRest'

class VideoProgressBar extends React.Component {
  constructor() {
    super()
    this.refvideoProgressBar = React.createRef()
  }

  handleVideoSkip = () => {
    this.props.setSeek(this.refvideoProgressBar.current.value)
  }

  render() {
    const { videoLength, videoBufferEnd, ...rest } = this.props
    const videoBufferDisplay = (this.props.videoBufferEnd / this.props.videoLength) * 100
    const progressBarStyle = {
      width: '100%',
      'input[type=range]&': {
        appearance: 'none',
        width: '100%',
        background: 'transparent',
      },

      'input[type=range]&:focus': {
        outline: 'none',
        '&::-webkit-slider-thumb': {
          background: '#999999',
        },
      },

      'input[type=range]&::-webkit-slider-thumb': {
        appearance: 'none',
        border: '1px solid #000000',
        height: 36,
        width: 16,
        borderRadius: 3,
        background: '#ffffff',
        cursor: 'pointer',
        marginTop: -14,
        boxShadow: '1px 1px 1px #000000, 0px 0px 1px #0d0d0d',
      },

      'input[type=range]&::-webkit-slider-thumb:hover': {
        background: '#777777',
      },

      'input[type=range]&::-webkit-slider-runnable-track': {
        width: '100%',
        height: 8.4,
        cursor: 'pointer',
        boxShadow: '1px 1px 1px #000000, 0px 0px 1px #0d0d0d',
        borderRadius: 1.3,
        border: '0.2px solid #010101',
        background: `linear-gradient(to right, #4b286d 0%,#4b286d ${videoBufferDisplay -
          0.01}% ,#b2b7b6 ${videoBufferDisplay}%)`,
      },
    }
    return (
      <input
        type="range"
        step="0.5"
        max={this.props.videoLength}
        value={this.props.videoCurrentTime}
        onChange={this.handleVideoSkip}
        onFocus={this.props.resetInactivityTimer}
        ref={this.refvideoProgressBar}
        css={progressBarStyle}
      />
    )
  }
}

VideoProgressBar.propTypes = {
  videoPlayer: PropTypes.object.isRequired,
  videoLength: PropTypes.number.isRequired,
  videoCurrentTime: PropTypes.number.isRequired,
  videoBufferEnd: PropTypes.number.isRequired,
  setSeek: PropTypes.func.isRequired,
  resetInactivityTimer: PropTypes.func.isRequired,
}

VideoProgressBar.defaultProps = {}

export default VideoProgressBar
