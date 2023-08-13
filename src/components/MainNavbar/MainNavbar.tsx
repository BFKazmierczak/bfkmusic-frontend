'use client'

import { useEffect } from 'react'
import NavbarItem from '@/interfaces/NavbarItem'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MainNavbarProps {
  items: NavbarItem[]
}

const MainNavbar = ({ items }: MainNavbarProps) => {
  const pathname = usePathname()

  const session = useSession()

  useEffect(() => {
    console.log('session:', session)
  }, [session])

  return (
    <div className=" flex flex-row gap-x-5">
      {items?.map((item) => {
        return (
          <Link
            className={` ${
              pathname === item.href && 'text-pink-600 underline'
            } text-[28px] transition-all ease-in-out`}
            key={item.href}
            href={item.href}>
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}

export default MainNavbar
