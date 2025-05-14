import React, { useState } from 'react'

import styles from '../ItemsList.css'

interface ImageProps {
  imageLink: string
  title: string
}

type ImageStateType = 'loading' | 'error' | 'ready'

export function Image({ imageLink, title }: ImageProps) {
  const [imgState, setImgState] = useState<ImageStateType>('loading')

  const onImageLoad = () => {
    setImgState('ready')
  }

  const onImageError = () => {
    setImgState('error')
  }

  return (
    <div className={styles['img-container']}>
      {imgState === 'loading' && <div className={styles['img-loading']} />}
      {imgState !== 'error' && (
        <img
          onLoad={onImageLoad}
          onError={onImageError}
          className={styles['product-img']}
          src={imageLink}
          alt={`Product ${title}`}
        />
      )}
    </div>
  )
}
