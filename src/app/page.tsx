import Link from 'next/link'

const HomePage = () => {
  return (
    <div className=" selection:bg-pink-600 mt-[100px] flex flex-col items-center ">
      <p className=" font-bold text-[48px]">Witaj na platformie BFK Music</p>
      <p className=" text-[24px]">
        Jesteś w miejscu, w którym wszystko masz pod ręką.
      </p>

      <Link className=" mt-5 basic-button" href="/register">
        Zarejestruj się
      </Link>
    </div>
  )
}

export default HomePage
