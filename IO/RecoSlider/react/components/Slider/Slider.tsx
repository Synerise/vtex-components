import type { PropsWithChildren } from 'react'
import React, { Children, useEffect, useMemo, useState } from 'react'

import styles from './Slider.css'
import { Arrow } from './Arrows'

interface SliderPropsType {
  itemsPerPage: number
}

export function Slider({
  itemsPerPage,
  children,
}: PropsWithChildren<SliderPropsType>) {
  const slides = Children.toArray(children)
  const [currentItem, setCurrentItem] = useState(0)

  useEffect(() => {
    setCurrentItem(0)
  }, [itemsPerPage])

  const itemWidth = 100 / itemsPerPage

  const prevSlide = () => {
    setCurrentItem((prev) =>
      prev - itemsPerPage < 0 ? 0 : prev - itemsPerPage
    )
  }

  const nextSlide = () => {
    setCurrentItem((prev) =>
      prev + itemsPerPage > slides.length - itemsPerPage
        ? slides.length - itemsPerPage
        : prev + itemsPerPage
    )
  }

  const isFull = useMemo(
    () => itemsPerPage < slides.length,
    [itemsPerPage, slides]
  )

  const isFirstSlide = currentItem === 0
  const isLastSlide = currentItem >= slides.length - itemsPerPage

  return (
    <div className={styles.slider__container}>
      <div className={styles.slider__content}>
        <div
          className={styles.slider__items}
          style={{
            marginLeft: `${-itemWidth * currentItem}%`,
            justifyContent: isFull ? 'start' : 'center',
          }}
        >
          {slides.map((slide, i) => (
            <div
              className={styles.slider__item}
              style={{ width: `${itemWidth}%` }}
              key={i * Math.random()}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {!isFirstSlide && <Arrow onClickHandler={prevSlide} side="left" />}
      {!isLastSlide && <Arrow onClickHandler={nextSlide} side="right" />}
    </div>
  )
}
