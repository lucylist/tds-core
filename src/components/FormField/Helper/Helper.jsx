import React from 'react'
import PropTypes from 'prop-types'

import Box from '../../Box/Box'

import safeRest from '../../../utils/safeRest'

import styles from './Helper.modules.scss'

const Helper = ({ feedback, children, ...rest }) => (
  <Box
    {...safeRest(rest)}
    inset={3}
    dangerouslyAddClassName={feedback ? styles[feedback] : styles.default}
  >
    {children}
  </Box>
)

Helper.propTypes = {
  feedback: PropTypes.oneOf(['success', 'error']),
  children: PropTypes.node.isRequired,
}

Helper.defaultProps = {
  feedback: undefined,
}

export default Helper