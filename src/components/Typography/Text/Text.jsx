import React from 'react'
import PropTypes from 'prop-types'

import safeRest from '../../../safeRest'
import TextSup from './TextSup/TextSup'
import TextSub from './TextSub/TextSub'

import styles from './Text.modules.scss'

const Text = ({ bold, size, invert, children, ...rest }) => {
  const classes = `
    ${styles[size]}
    ${bold ? styles.boldFont : styles[`${size}Font`]}
    ${invert ? styles.colorInverted : styles.color}
  `

  return (
    <span {...safeRest(rest)} className={classes}>
      {children}
    </span>
  )
}

Text.propTypes = {
  /**
   * Embolden text without conveying any special importance or relevance.
   */
  bold: PropTypes.bool,
  /**
   * Font size.
   */
  size: PropTypes.oneOf([
    'base',
    'small',
    'medium',
    'large'
  ]),
  /**
   * Invert span style to appear light on dark backgrounds.
   */
  invert: PropTypes.bool,
  /**
   * The text you wish to apply special styles.
   */
  children: PropTypes.node.isRequired
}

Text.defaultProps = {
  bold: false,
  size: 'base',
  invert: false
}

Text.Sup = TextSup
Text.Sub = TextSub

export default Text