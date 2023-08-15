import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import LoginButton from '../components/Buttons/LoginButton'

const HomePage = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className=" p-10 sm:p-0 selection:bg-pink-600 sm:mt-32 flex flex-col gap-y-2">
      <p className=" font-bold text-3xl sm:text-[48px] text-left sm:text-center">
        {session ? 'Witaj ponownie!' : 'Witaj na platformie BFK Music'}
      </p>
      <p className=" text-lg sm:text-2xl text-left sm:text-center">
        Jesteś w miejscu, w którym wszystko masz pod ręką.
      </p>

      {!session && (
        <div className=" flex flex-col items-center gap-y-2 mt-5">
          <Link className=" basic-button" href="/register">
            Zarejestruj się
          </Link>
          LUB
          <LoginButton />
        </div>
      )}
    </div>
  )
}

export default HomePage
