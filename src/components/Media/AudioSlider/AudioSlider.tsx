'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface AudioSliderProps {
  totalTime: number
  currentTime: number
  onTimeChange?: (newTime: number) => void
}

const AudioSlider = ({
  totalTime,
  currentTime,
  onTimeChange
}: AudioSliderProps) => {
  const [pointWidth, setPointWidth] = useState<string>()
  const [progress, setProgress] = useState<string>('0')

  const [moving, setMoving] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && totalTime) {
      if (typeof containerRef.current?.clientWidth === 'number') {
        const width = (containerRef.current.clientWidth / totalTime).toFixed(2)

        setPointWidth(width)
      }
    }
  }, [containerRef.current, totalTime])

  useEffect(() => {
    setProgress(((currentTime / totalTime) * 100).toFixed(2))
  }, [currentTime])

  function handleProgressBarClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const clientX = event.clientX
    const clientY = event.clientY

    if (containerRef.current) {
      const div = containerRef.current.getBoundingClientRect()

      const divX = div.left
      const divY = div.bottom

      const relativeX = clientX - divX
      const relativeY = divY - clientY

      const percentage = (relativeX / div.width) * 100

      console.log('relativeX:', relativeX)
      console.log('div width:', div.width)

      console.log('percentage:', percentage)

      const newTime = (percentage / 100) * totalTime

      console.log('new time:', newTime)
      if (onTimeChange) onTimeChange(newTime)
    }
  }

  return (
    <>
      <div
        className=" relative flex flex-row items-center group bg-neutral-400 hover:bg-neutral-500 
          h-2 w-full transition-colors ease-in-out"
        ref={containerRef}
        onMouseDown={(event) => setMoving(true)}
        onMouseMove={
          moving
            ? (event) => {
                handleProgressBarClick(event)
              }
            : undefined
        }
        onMouseUp={() => setMoving(false)}
        onMouseLeave={() => setMoving(false)}
        onClick={handleProgressBarClick}>
        <div
          className={` bg-pink-600 group-hover:bg-pink-700 h-2 transition-colors ease-in-out`}
          style={{ width: `${progress}%` }}
        />
        <div
          className={` absolute w-3 h-3 rounded-full bg-pink-800`}
          style={{ left: `${Number(progress) - 1}%` }}
        />
      </div>
    </>
  )
}

export default AudioSlider
