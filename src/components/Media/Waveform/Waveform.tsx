import { useState } from 'react'

interface WaveformProps {
  peaks: number[]
  selecting?: boolean
  selectionBegin?: number
  selectionEnd?: number
}

const Waveform = ({
  peaks,
  selecting,
  selectionBegin,
  selectionEnd
}: WaveformProps) => {
  const [currentlySelecting, setCurrentlySelecting] = useState<
    'start' | 'end' | undefined
  >('start')

  const [startBound, setStartBound] = useState<number>(0)
  const [endBound, setEndBound] = useState<number>(0)

  function getPeakHeight(peak: number) {
    if (peak > 0.75) return peak * 90
    else return peak * 50
  }

  return (
    <div
      className=" relative py-2 w-fit bg-neutral-700"
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        if (selecting) {
          const boundingRect = event.currentTarget.getBoundingClientRect()

          if (currentlySelecting === 'start') {
            const leftBound = event.clientX - boundingRect.left

            console.log('Bound:', leftBound)

            setStartBound(leftBound)

            setCurrentlySelecting('end')
            // event.currentTarget.
          } else {
            const rightBound = event.clientX - boundingRect.left

            setEndBound(rightBound)
            setCurrentlySelecting(undefined)
          }
        }
      }}>
      {selecting && startBound > 0 && (
        <div
          className=" absolute h-24 w-full bg-red-500 bg-opacity-50"
          style={{
            left: `${startBound}px`,
            width: `${endBound - startBound}px`
          }}
        />
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
