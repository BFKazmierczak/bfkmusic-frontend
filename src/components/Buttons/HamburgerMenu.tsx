'use client'

import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import PopupMenu from '../Menus/PopupMenu/PopupMenu'

const HamburgerMenu = () => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <div
      className=" relative bg-pink-600 text-white sm:hidden"
      onClick={() => setExpanded((prev) => !prev)}>
      <MenuIcon
        className={` ${expanded && 'rotate-90'} transition-all ease-in-out`}
        style={{ fontSize: '3em' }}
      />

      <PopupMenu open={expanded} setOpen={setExpanded} left />

      {/* <div
        className={` bg-red-500 absolute ${
          !expanded ? 'hidden -translate-x-1' : ''
        } top-16 transition-all ease-in-out`}>
        <p>Główna</p>
        <p>Biblioteka</p>
      </div> */}
    </div>
  )
}

export default HamburgerMenu
