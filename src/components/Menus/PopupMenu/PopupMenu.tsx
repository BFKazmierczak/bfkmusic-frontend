'use client'

import { LegacyRef, MutableRefObject, useEffect, useRef, useState } from 'react'
import PopupMenuItem from './PopupMenuItem'
import { signOut } from 'next-auth/react'

interface PopupMenuInterface {
  open: boolean
  setOpen: (state: boolean) => void
}

const useOutsideAlerter = (
  ref: MutableRefObject<LegacyRef<HTMLDivElement>>,
  callback: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

const PopupMenu = ({ open, setOpen }: PopupMenuInterface) => {
  const menuRef = useRef(null)
  useOutsideAlerter(menuRef, () => setOpen(false))

  //   useEffect(() => {
  // if (menuRef?.current && open) menuRef.current.focus()
  //   })

  return (
    <div
      className={`absolute text-center w-48 right-0 top-16 ${
        !open && 'hidden'
      } bg-neutral-300 outline-none shadow-md`}
      tabIndex={0}
      ref={menuRef}
      //   onBlur={() => setOpen(false)}
    >
      <div className=" flex flex-col gap-y-3 p-5">
        <PopupMenuItem text="Mój profil" href="/account" />

        <PopupMenuItem text="Ustawienia" href="/settings" />

        <PopupMenuItem text="Wyloguj się" onClick={() => signOut()} />
      </div>
    </div>
  )
}

export default PopupMenu
