import { Ref, useRef, useState } from 'react'
import MarkerButton from './MarkerButton/MarkerButton'

interface WaveformProps {
  peaks: number[]
  selecting?: boolean
  selectionBegin?: number
  selectionEnd?: number
  onScroll?: (left: number, visibleWidth: number) => void
}

const Waveform = ({
  peaks,
  selecting,
  selectionBegin,
  selectionEnd,
  onScroll
}: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentlySelecting, setCurrentlySelecting] = useState<
    'start' | 'end' | undefined
  >('start')

  const [startBound, setStartBound] = useState<number>(50)
  const [endBound, setEndBound] = useState<number>(100)

  const [movingLeft, setMovingLeft] = useState<boolean>(false)
  const [movingRight, setMovingRight] = useState<boolean>(false)

  function getPeakHeight(peak: number) {
    if (peak > 0.75) return peak * 90
    else return peak * 50
  }

  return (
    <div
      className=" relative py-2 w-fit bg-neutral-700"
      ref={containerRef}
      // onClick={(event: React.MouseEvent<HTMLDivElement>) => {
      //   if (selecting) {
      //     const boundingRect = event.currentTarget.getBoundingClientRect()

      //     if (currentlySelecting === 'start') {
      //       const leftBound = event.clientX - boundingRect.left

      //       console.log('Bound:', leftBound)

      //       setStartBound(leftBound)

      //       setCurrentlySelecting('end')
      //       // event.currentTarget.
      //     } else {
      //       const rightBound = event.clientX - boundingRect.left

      //       if (rightBound < startBound) {
      //         setStartBound(rightBound)
      //         setEndBound(startBound)
      //       } else {
      //         setEndBound(rightBound)
      //       }

      //       setCurrentlySelecting('start')
      //     }
      //   }
      // }}
      onMouseMove={(event) => {
        // console.log('MOUSE MOVING...')

        if (containerRef.current && (movingLeft || movingRight)) {
          const boundingRect = containerRef.current.getBoundingClientRect()

          // console.log('current:', containerRef.current)

          const bound = event.clientX - boundingRect.left

          console.log('bound:', bound)

          const offsetParent = containerRef.current.offsetParent

          if (offsetParent) {
            const relativeBoundingRect = offsetParent.getBoundingClientRect()

            // console.log(relativeBoundingRect)

            const relativeBound = event.clientX - relativeBoundingRect.left

            console.log('relative bound:', relativeBound)

            const visibleWidth = offsetParent.clientWidth

            const leftThreshold = 80
            const rightThreshold = visibleWidth - 70

            const triggerFreeX = rightThreshold - leftThreshold

            // get position relative to visibleWidth

            // console.log('visible: ', visibleWidth)
            // console.log('trigger free zone:', triggerFreeX)
            // console.log('scroll width', offsetParent.scrollWidth)

            if (relativeBound > rightThreshold) {
              console.log('inisde right threshold')
              if (onScroll) onScroll(30, visibleWidth)
            } else if (relativeBound < leftThreshold) {
              console.log('inisde left threshold')
              if (onScroll) onScroll(-30, visibleWidth)
            }
          }

          if (movingLeft) setStartBound(bound)
          else if (movingRight) setEndBound(bound)
        }
      }}
      onMouseUp={(event) => {
        if (movingLeft) setMovingLeft(false)
        else if (movingRight) setMovingRight(false)
      }}>
      {selecting && startBound > 0 && (
        <div
          className=" absolute h-24 w-full bg-pink-500 bg-opacity-50"
          style={{
            left: `${startBound}px`,
            width: `${endBound - startBound}px`
          }}>
          <div className=" absolute flex justify-center items-center h-24 w-1 bg-pink-800">
            <MarkerButton
              onMouseDown={(event) => {
                console.log('mouse down')

                setMovingLeft(true)
              }}
            />
          </div>

          <div
            className=" absolute flex justify-center items-center h-24 w-1 bg-pink-800"
            style={{ right: `0px` }}>
            <MarkerButton
              direction="right"
              onMouseDown={(event) => {
                console.log('mouse down')

                setMovingRight(true)
              }}
            />
          </div>
        </div>
      )}

      <div className=" flex items-center gap-x-[0.2px]">
        {peaks.map((peak, index) => (
          <div
            className=" w-[1px] bg-pink-200"
            style={{
              height: `${getPeakHeight(peak)}px`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Waveform
