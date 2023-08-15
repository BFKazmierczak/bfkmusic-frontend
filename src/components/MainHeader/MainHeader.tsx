import Link from 'next/link'
import MainNavbar from '../MainNavbar/MainNavbar'
import { signIn } from 'next-auth/react'
import LoginButton from '../Buttons/LoginButton'
import LogoutButton from '../Buttons/LogoutButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UserAvatar from '../Buttons/UserAvatar'
import HamburgerMenu from '../Buttons/HamburgerMenu'

const MainHeader = async () => {
  const session = await getServerSession(authOptions)

  const navBarItems = [
    { name: 'Strona główna', href: '/' },
    { name: 'Katalog', href: '/catalog' }
  ]

  if (session) navBarItems.push({ name: 'Moja biblioteka', href: '/library' })

  console.log('Session:', session)

  return (
    <div className=" p-5 flex flex-row justify-between items-center bg-neutral-100">
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
        {/* {!session && (
          <>
            <LoginButton />
            <Link className=" secondary-button" href="/register">
              Zarejestruj się
            </Link>
          </>
        )} */}

        <div className=" flex flex-row items-center gap-x-5 ">
          <p className=" text-right">
            {session && (
              <p className="">
                Zalogowano:
                <br />
              </p>
            )}
            <b>{session ? session.user.user.username : 'Niezalogowany'}</b>
          </p>

          <UserAvatar />
        </div>
      </div>
    </div>
  )
}

export default MainHeader
