import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { HTMLAttributes, useState } from 'react'

interface MarkerButtonProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'left' | 'right'
}

const MarkerButton = ({ direction = 'left', ...props }: MarkerButtonProps) => {
  const [mouseDown, setMouseDown] = useState<boolean>(false)

  return (
    <div
      {...props}
      className=" absolute flex justify-center items-center rounded-full w-6 h-6
          bg-neutral-800 text-pink-600 hover:bg-neutral-600 cursor-pointer"
      onMouseDown={(event) => {
        setMouseDown(true)

        if (props.onMouseDown) props.onMouseDown(event)
      }}
      onMouseUp={(event) => {
        setMouseDown(false)
      }}
      onMouseLeave={() => setMouseDown(false)}
      onMouseMove={(event) => {
        if (mouseDown) {
          if (props.onMouseMove) props.onMouseMove(event)
        }
      }}>
      {direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />}
    </div>
  )
}

export default MarkerButton
