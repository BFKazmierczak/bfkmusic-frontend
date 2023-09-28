import { ReactNode } from 'react'

interface IconButtonProps {
  icon: ReactNode
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return (
    <>
      <div
        className=" text-neutral-600 hover:bg-neutral-400 hover:text-neutral-800 cursor-pointer transition-all ease-in-out"
        onClick={onClick}>
        {icon}
      </div>
    </>
  )
}

export default IconButton
