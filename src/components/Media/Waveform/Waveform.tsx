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
  onScroll
}: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progCanvasRef = useRef<HTMLCanvasElement>(null)

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
      console.log('useEffect called')

      const canvas = canvasRef.current
      const progCanvas = progCanvasRef.current

      const ctx = canvas.getContext('2d')
      const progCtx = progCanvas.getContext('2d')

      canvas.width = containerRef.current.scrollWidth
      progCanvas.width = canvas.width

      if (ctx && progCtx) {
        // ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas

        ctx.fillStyle = '#fbcfe8'
        progCtx.fillStyle = '#be185d'

        const waveformHeight = 75

        const totalWidth = containerRef.current.scrollWidth
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
    }
  }, [peaks, canvasRef, progCanvasRef, containerRef])

  useEffect(() => {
    if (progressRef.current && containerRef.current) {
      handleProgressScroll(
        progressRef.current,
        containerRef.current,
        currentTime,
        previousWidth
      )
    }
  }, [currentTime])

  const [startBound, setStartBound] = useState<number>(50)
  const [endBound, setEndBound] = useState<number>(100)

  const [movingLeft, setMovingLeft] = useState<boolean>(false)
  const [movingRight, setMovingRight] = useState<boolean>(false)

  const [barWidth, setBarWidth] = useState<number>(0)

  function getPeakHeight(peak: number) {
    if (peak > 0.75) return peak * 90
    else return peak * 50
  }

  function handleProgressScroll(
    progressDiv: HTMLDivElement,
    containerDiv: HTMLDivElement,
    currentTime: number,
    prevWidth: number = 0
  ) {
    const progressWidth = progressDiv.offsetWidth

    const timePercentage = currentTime / totalTime

    if (containerDiv.offsetParent) {
      const visibleWidth = containerDiv.offsetParent?.clientWidth

      const newWidth = Math.ceil(containerDiv.scrollWidth * timePercentage)

      const diff = newWidth - prevWidth

      setBarWidth(newWidth)

      if (
        progressWidth > visibleWidth - diff * 20 &&
        progressWidth < containerDiv.scrollWidth
      ) {
        if (onScroll) {
          onScroll(diff)
        }
      }
    }
  }

  return (
    <div
      className=" relative py-2 w-fit bg-neutral-700 transition-all ease-in-out"
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

      {/* <div
        ref={progressRef}
        style={{ width: `${barWidth}px` }}
        className=" h-2 bg-green-500 bg-opacity-80"></div> */}

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
