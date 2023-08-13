import Link from 'next/link'
import MainNavbar from '../MainNavbar/MainNavbar'
import { signIn } from 'next-auth/react'
import LoginButton from '../Buttons/LoginButton'
import LogoutButton from '../Buttons/LogoutButton'

const MainHeader = () => {
  return (
    <div className=" p-5 flex flex-row justify-between items-center bg-neutral-100">
      <div className=" flex flex-row gap-x-5 items-end leading-none ">
        <Link href="/">
          <p className=" font-bold text-[40px] px-3 text-white bg-pink-600">
            BFK Music
          </p>
        </Link>

        <MainNavbar
          items={[
            { name: 'Strona główna', href: '/' },
            { name: 'Katalog', href: '/catalog' },
            { name: 'Moja biblioteka', href: '/library' }
          ]}
        />
      </div>

      <div className=" flex flex-row gap-x-5">
        {/* <Link className=" secondary-button" href="/login">
          Zaloguj się
        </Link> */}

        <LoginButton />

        <LogoutButton />

        <Link className=" secondary-button" href="/register">
          Zarejestruj się
        </Link>
      </div>
    </div>
  )
}

export default MainHeader
