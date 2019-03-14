import React from 'react'
import SVGIcon from '../SVGIcon'

const Time = props => (
  <SVGIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <path
          id="time-a"
          d="M16.5049,11.4668 C16.8189,11.4668 17.0379,11.6868 17.0379,11.9998 C17.0379,12.3138 16.8189,12.5328 16.5049,12.5328 L11.9999,12.5328 C11.6869,12.5328 11.4669,12.3138 11.4669,11.9998 L11.4669,3.8098 C11.4669,3.4958 11.6869,3.2768 11.9999,3.2768 C12.3139,3.2768 12.5329,3.4958 12.5329,3.8098 L12.5329,11.4668 L16.5049,11.4668 Z M12,22.9336 C18.029,22.9336 22.934,18.0296 22.934,11.9996 C22.934,5.9716 18.029,1.0666 12,1.0666 C5.972,1.0666 1.066,5.9716 1.066,11.9996 C1.066,18.0296 5.972,22.9336 12,22.9336 Z M12,-0.0004 C18.616,-0.0004 24,5.3836 24,11.9996 C24,18.6166 18.616,23.9996 12,23.9996 C5.383,23.9996 0,18.6166 0,11.9996 C0,5.3836 5.383,-0.0004 12,-0.0004 Z"
        />
      </defs>
      <use fill="#4B286D" fillRule="evenodd" xlinkHref="#time-a" />
    </svg>
  </SVGIcon>
)

export default Time
