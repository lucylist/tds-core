import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FlexGrid from '@tds/core-flex-grid'

import safeRest from '../../../../../shared/utils/safeRest'

class VolumeSlider extends React.Component {
  constructor() {
    super()
    this.refVolumeSlider = React.createRef()
  }

  componentDidMount() {
    this.refVolumeSlider.current.defaultValue = this.props.videoDefaultVolume
    this.props.setVolume(this.refVolumeSlider.current.value)
  }

  handleVolumeChange = () => {
    this.props.setVolume(this.refVolumeSlider.current.value)
  }

  render() {
    const { videoDefaultVolume, ...rest } = this.props
    return (
      <div>
        0
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={this.props.videoCurrentVolume}
          ref={this.refVolumeSlider}
          onChange={this.handleVolumeChange}
          onFocus={this.props.resetInactivityTimer}
        />
        1
      </div>
    )
  }
}

VolumeSlider.propTypes = {
  videoPlayer: PropTypes.object.isRequired,
  videoDefaultVolume: PropTypes.number.isRequired,
  videoCurrentVolume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
  resetInactivityTimer: PropTypes.func.isRequired,
}

VolumeSlider.defaultProps = {}

export default VolumeSlider
