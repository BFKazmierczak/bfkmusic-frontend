'use client'

import { signIn, signOut } from 'next-auth/react'

const LogoutButton = () => {
  return (
    <button className=" secondary-button" onClick={() => signOut()}>
      Wyloguj się
    </button>
  )
}

export default LogoutButton
