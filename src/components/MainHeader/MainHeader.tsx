import Link from 'next/link'
import MainNavbar from '../MainNavbar/MainNavbar'
import { signIn } from 'next-auth/react'
import LoginButton from '../Buttons/LoginButton'
import LogoutButton from '../Buttons/LogoutButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UserAvatar from '../Buttons/UserAvatar'
import HamburgerMenu from '../Menus/HamburgerMenu/HamburgerMenu'

const MainHeader = async () => {
  const session = await getServerSession(authOptions)

  const navBarItems = [
    { name: 'Strona główna', href: '/' },
    { name: 'Katalog', href: '/catalog' }
  ]

  if (session) navBarItems.push({ name: 'Moja biblioteka', href: '/library' })

  return (
    <div className=" sticky top-0 w-full p-5 flex flex-row justify-between items-center bg-neutral-100">
      <HamburgerMenu />

      <div className=" hidden sm:flex flex-row gap-x-5 items-end leading-none">
        <Link href="/">
          <p className=" font-bold text-4xl px-3 text-white bg-pink-600">
            BFK Music
          </p>
        </Link>

        <MainNavbar items={navBarItems} />
      </div>

      <div className=" flex flex-row gap-x-5">
        <div className=" flex flex-row items-center gap-x-5 ">
          <div className=" text-right">
            {session && (
              <div>
                Zalogowano:
                <br />
              </div>
            )}
            <b>{session ? session.user?.username : 'Niezalogowany'}</b>
          </div>

          <UserAvatar loggedIn={session !== null} />
        </div>
      </div>
    </div>
  )
}

export default MainHeader
