import React from 'react'

import styles from './Slider.css'

interface ArrowPropsType {
  onClickHandler: () => void
  side: 'left' | 'right'
}

const ARROW = {
  left: (
    <svg viewBox="0 0 24 24" className="angle-left-m">
      <path d="M16.2 4.3c-.4-.4-1-.4-1.4 0l-7 7c-.4.4-.4 1 0 1.4l7 7c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L9.9 12l6.3-6.3c.4-.4.4-1 0-1.4z" />
    </svg>
  ),
  right: (
    <svg viewBox="0 0 24 24" className="angle-right-m">
      <path d="M9.2 4.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l6.3 6.3-6.3 6.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l7-7c.4-.4.4-1 0-1.4l-7-7z" />
    </svg>
  ),
}

export function Arrow({ onClickHandler, side }: ArrowPropsType) {
  return (
    <button
      className={`${styles.slider__btn} ${styles[`slider__btn--${side}`]}`}
      onClick={onClickHandler}
    >
      {ARROW[side]}
    </button>
  )
}
