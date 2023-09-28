'use client'

import { useState } from 'react'
import PopupMenu from '../PopupMenu/PopupMenu'
import Link from 'next/link'

import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import HamburgerItem from './HamburgerItem'

const HamburgerMenu = () => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <div className=" relative sm:hidden flex flex-col">
      <div
        className={` fixed inset-0 z-10 ${
          !expanded && '-translate-x-48'
        } bg-neutral-800 w-48 h-full transition-all ease-in-out`}>
        <div className=" px-5 py-7 bg-neutral-700 h-[5.5rem] w-full" />

        <div className=" flex flex-col justify-center gap-y-1 text-white">
          <HamburgerItem href="/" onClick={() => setExpanded(false)}>
            <HomeIcon />
            Strona Główna
          </HamburgerItem>

          <HamburgerItem href="/catalog" onClick={() => setExpanded(false)}>
            <FindInPageIcon />
            Katalog
          </HamburgerItem>

          <HamburgerItem href="/library" onClick={() => setExpanded(false)}>
            <AudioFileIcon />
            Moja biblioteka
          </HamburgerItem>
        </div>
      </div>

      <div
        className={` ${
          !expanded && 'opacity-0 hidden'
        } fixed inset-0 z-[5] bg-black bg-opacity-[75%] transition-all ease-in-out`}
        onClick={() => setExpanded((prev) => !prev)}
      />

      <div
        className={` relative flex flex-row items-center gap-x-5 z-10 text-white ${
          expanded ? '' : ' -translate-x-[6.5rem]'
        } transition-all ease-in-out`}>
        <div className={` px-1 font-bold select-none w-20 bg-pink-700`}>
          BFK <br /> Music
        </div>
        <MenuIcon
          className={` ${
            expanded && 'rotate-90'
          } bg-pink-600 transition-all ease-in-out`}
          style={{ fontSize: '3em' }}
          onClick={() => setExpanded((prev) => !prev)}
        />
      </div>
    </div>
  )
}

export default HamburgerMenu
