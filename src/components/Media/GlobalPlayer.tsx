'use client'

import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGlobalPlayer } from '../Providers/GlobalPlayerProvider'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Pause from '@mui/icons-material/Pause'
import AudioSlider from './AudioSlider/AudioSlider'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import formatTime from '@/src/utils/formatTime'

const GlobalPlayer = () => {
  // const {
  //   songData,
  //   playing,
  //   play,
  //   pause,
  //   playSong,
  //   changeTime,
  //   currentFormattedTime,
  //   currentTime,
  //   duration
  // } = useGlobalPlayer()

  const {
    songData,
    playing,
    playSong,
    pause,
    changeTime,
    currentTime,
    setCurrentTime,
    currentFormattedTime,
    duration
  } = useGlobalPlayerStore()

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted &&
        createPortal(
          <div className=" fixed z-50 bottom-0 flex flex-row w-full h-20 border-t-2 border-neutral-400">
            <div className=" absolute left-0 bg-neutral-200 aspect-square h-full p-2">
              <div className=" bg-pink-600 aspect-square h-full"></div>
            </div>

            <div className=" flex flex-col justify-center items-center w-full bg-white">
              <div className=" flex justify-between items-end w-[50%]">
                {currentFormattedTime}

                {playing ? (
                  <div onClick={() => pause()}>
                    <Pause
                      className=" text-pink-600"
                      style={{ fontSize: '3rem' }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (songData) playSong(songData)
                    }}>
                    <PlayArrow
                      className=" text-pink-600"
                      style={{ fontSize: '3rem' }}
                    />
                  </div>
                )}

                {formatTime(duration)}
              </div>

              <div className=" w-[50%]">
                <AudioSlider
                  currentTime={currentTime}
                  totalTime={duration}
                  onTimeChange={(newTime) => {
                    changeTime(newTime)
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default GlobalPlayer
