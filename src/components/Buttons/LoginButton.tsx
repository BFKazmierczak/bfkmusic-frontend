'use client'

import { signIn } from 'next-auth/react'

const LoginButton = () => {
  return (
    <button className=" secondary-button" onClick={() => signIn()}>
      Zaloguj się
    </button>
  )
}

export default LoginButton
