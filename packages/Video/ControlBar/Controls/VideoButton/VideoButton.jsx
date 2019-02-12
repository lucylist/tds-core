import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import safeRest from '../../../../../shared/utils/safeRest'

const VideoButton = ({ videoPlayer, label, children, ...rest }) => {
  return (
    <div>
      <button>{children}</button>
    </div>
  )
}
VideoButton.propTypes = {
  label: PropTypes.string.isRequired,
}

VideoButton.defaultProps = {}

export default VideoButton
