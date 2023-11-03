import {
  Ref,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import MarkerButton from './MarkerButton/MarkerButton'
import usePrevious from '@/src/hooks/usePrevious'

interface WaveformProps {
  peaks: number[]
  selecting?: boolean
  selectionBegin?: number
  selectionEnd?: number
  totalTime: number
  currentTime: number
  highlight?: string
  onTimeChange?: (newTime: number) => void
  onScroll?: (left: number) => void
  onSlide?: () => void
}

const Waveform = ({
  peaks,
  selecting,
  selectionBegin,
  selectionEnd,
  totalTime,
  currentTime,
  highlight,
  onTimeChange,
  onScroll,
  onSlide
}: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progCanvasRef = useRef<HTMLCanvasElement>(null)

  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 0])
  const [changedManually, setChangedManually] = useState<boolean>(false)

  const previousWidth = usePrevious(
    Math.ceil(
      (containerRef.current?.scrollWidth || 0) * (currentTime / totalTime)
    )
  )

  useEffect(() => {
    if (
      peaks.length > 0 &&
      canvasRef.current &&
      progCanvasRef.current &&
      containerRef.current
    ) {
      const totalWidth = containerRef.current.scrollWidth * 5 // let it be wider!

      const canvas = canvasRef.current
      const progCanvas = progCanvasRef.current

      const ctx = canvas.getContext('2d')
      const progCtx = progCanvas.getContext('2d')

      canvas.width = totalWidth
      progCanvas.width = totalWidth

      if (ctx && progCtx) {
        ctx.fillStyle = '#fbcfe8'
        progCtx.fillStyle = '#be185d'

        const waveformHeight = 75

        const segmentCount = peaks.length
        const segmentWidth = totalWidth / segmentCount

        peaks.forEach((peak, index) => {
          const xPos = index * segmentWidth
          const segmentHeight = waveformHeight * peak

          const offsetTop = (waveformHeight - segmentHeight) / 2

          ctx.fillRect(xPos, offsetTop, segmentWidth * 1, segmentHeight)
          progCtx.fillRect(xPos, offsetTop, segmentWidth * 1, segmentHeight)
        })
      }

      const scrollLeft = containerRef.current.scrollLeft

      if (containerRef.current.offsetParent) {
        const visibleWidth = containerRef.current.offsetParent?.clientWidth

        const right = scrollLeft + visibleWidth

        console.log('setting visible range to:', scrollLeft, right)

        setVisibleRange([scrollLeft, right])
      }
    }
  }, [peaks, canvasRef, progCanvasRef, containerRef])

  useEffect(() => {
    if (
      progCanvasRef.current &&
      containerRef.current &&
      !(visibleRange[0] === 0 && visibleRange[1] === 0)
    ) {
      if (!changedManually) {
        handleProgressChange(containerRef.current, currentTime, previousWidth)
      } else
        handleProgressChange(
          containerRef.current,
          currentTime,
          previousWidth,
          true
        )
    }
  }, [currentTime])

  // useEffect(() => {
  //   // console.log(...visibleRange)
  // }, [visibleRange])

  useEffect(() => {
    console.log({ changedManually })
  }, [changedManually])

  const [startBound, setStartBound] = useState<number>(50)
  const [endBound, setEndBound] = useState<number>(100)

  const [movingLeft, setMovingLeft] = useState<boolean>(false)
  const [movingRight, setMovingRight] = useState<boolean>(false)

  function handleProgressChange(
    containerDiv: HTMLDivElement,
    currentTime: number,
    prevWidth: number = 0,
    shouldCenter: boolean = false
  ) {
    const timePercentage = currentTime / totalTime

    if (containerDiv.offsetParent) {
      const newWidth = Math.ceil(containerDiv.scrollWidth * timePercentage)
      const diff = newWidth - prevWidth

      const scrollLeft = containerDiv.scrollLeft

      const visible = containerDiv.offsetParent?.clientWidth

      const leftEdge = newWidth - scrollLeft
      const rightEdge = scrollLeft + visible

      const scrollTreshold = rightEdge - diff

      if (newWidth >= scrollTreshold - scrollTreshold * 0.15 && !shouldCenter) {
        containerDiv.scrollBy({ left: diff, behavior: 'instant' })
      } else if (shouldCenter) {
        const scrollValue =
          containerDiv.scrollWidth * timePercentage - visible / 2

        setChangedManually(false)
        containerDiv.scrollLeft = scrollValue
      }

      setVisibleRange([leftEdge, rightEdge])
    }
  }

  function handleWaveformClick(event: React.MouseEvent<HTMLDivElement>) {
    const left = event.currentTarget.getBoundingClientRect().left

    const clickedX = event.currentTarget.scrollLeft + (event.clientX - left)

    const percentage = clickedX / event.currentTarget.scrollWidth

    setChangedManually(true)

    const newTime = totalTime * percentage
    if (onTimeChange) onTimeChange(newTime)
  }

  return (
    <div
      className=" relative overflow-x-auto py-2 bg-neutral-700 transition-all ease-in-out"
      ref={containerRef}
      onClick={handleWaveformClick}
      onMouseMove={(event) => {
        if (containerRef.current && (movingLeft || movingRight)) {
          const boundingRect = containerRef.current.getBoundingClientRect()

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

            // get position relative to visibleWidth

            if (relativeBound > rightThreshold) {
              if (onScroll) onScroll(30)
            } else if (relativeBound < leftThreshold) {
              if (onScroll) onScroll(-30)
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

      <div className=" relative">
        <canvas
          ref={progCanvasRef}
          className=" absolute z-50"
          style={{
            clipPath: `inset(0% ${
              100 - (currentTime === 0 ? 0 : (currentTime / totalTime) * 100)
            }% 0% 0%)`,
            overflow: 'hidden'
          }}
        />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default Waveform
