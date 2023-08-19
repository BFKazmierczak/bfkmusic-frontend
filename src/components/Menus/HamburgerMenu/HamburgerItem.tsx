import Link from 'next/link'
import { ReactNode } from 'react'

interface HamburgerItemProps {
  children: ReactNode
  href: string
  onClick?: () => void
}

const HamburgerItem = ({ children, href, onClick }: HamburgerItemProps) => {
  return (
    <>
      <Link
        className=" flex flex-row items-center gap-x-2 px-4 py-2 hover:bg-pink-600"
        href={href}
        onClick={() => {
          if (onClick) onClick()
        }}>
        {children}
      </Link>
    </>
  )
}

export default HamburgerItem
