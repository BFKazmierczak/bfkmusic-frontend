'use client'

import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGlobalPlayer } from '../Providers/GlobalPlayerProvider'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Pause from '@mui/icons-material/Pause'

const GlobalPlayer = () => {
  const { songData, playing, play, pause, changeSong } = useGlobalPlayer()

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted &&
        createPortal(
          <div className=" absolute bottom-0 flex flex-row w-full h-20 border-t-2 border-neutral-400">
            <div className=" absolute left-0 bg-neutral-200 aspect-square h-full p-2">
              <div className=" bg-pink-600 aspect-square h-full"></div>
            </div>

            <div className=" flex justify-center items-center w-full">
              {playing ? (
                <div onClick={() => pause()}>
                  <Pause
                    className=" text-pink-600"
                    style={{ fontSize: '3rem' }}
                  />
                </div>
              ) : (
                <div onClick={() => play()}>
                  <PlayArrow
                    className=" text-pink-600"
                    style={{ fontSize: '3rem' }}
                  />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default GlobalPlayer