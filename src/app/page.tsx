import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import LoginButton from '../components/Buttons/LoginButton'

const HomePage = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className=" selection:bg-pink-600 mt-[100px] flex flex-col items-center ">
      <p className=" font-bold text-[48px]">
        {session ? 'Witaj ponownie!' : 'Witaj na platformie BFK Music'}
      </p>
      <p className=" text-[24px]">
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
