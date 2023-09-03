'use client'

import { useEffect, useRef, useState } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from './AudioSlider/AudioSlider'
import { useSession } from 'next-auth/react'
import { Song } from '@/src/interfaces/SongsResult'
import { useGlobalPlayer } from '../Providers/GlobalPlayerProvider'

interface AudioPlayerProps {
  song: Song
  name: string
  url: string
}

const AudioPlayer = ({ song, name, url }: AudioPlayerProps) => {
  const session = useSession()

  const { play, pause, changeSong } = useGlobalPlayer()

  const [playing, setPlaying] = useState<boolean>(false)

  const [currentTime, setCurrentTime] = useState<number>(0)
  const [currentFormattedTime, setCurrentFormattedTime] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (playing) audioRef.current?.play()
    else if (!audioRef.current?.paused) audioRef.current?.pause()
  }, [playing])

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  function handleTimeUpdate() {
    const time = audioRef.current?.currentTime
    if (time) {
      const formatted = formatTime(time)
      setCurrentTime(time)
      setCurrentFormattedTime(formatted)
    }
  }

  return (
    <div className=" flex flex-row bg-neutral-300 w-72 sm:w-96 ">
      <div className=" h-full aspect-square bg-neutral-700">
        <div className=" flex justify-center items-center w-full h-full text-white bg-pink-600">
          {playing ? (
            <div
              onClick={() => {
                pause()
              }}>
              <PauseIcon style={{ fontSize: '3rem' }} />
            </div>
          ) : (
            <div
              onClick={() => {
                changeSong(song)
              }}>
              <PlayArrowIcon style={{ fontSize: '3rem' }} />
            </div>
          )}
        </div>
      </div>

      <div className=" flex justify-center w-full">
        <div className=" flex flex-col w-full gap-y-2 p-3">
          <span>{name}</span>

          <AudioSlider
            totalTime={audioRef.current?.duration}
            currentTime={currentTime}
            onTimeChange={(newTime) => {
              if (audioRef.current) {
                audioRef.current.currentTime = newTime
              }
            }}
          />

          <div>
            <span>{currentFormattedTime} /</span>
            <span>{formatTime(audioRef.current?.duration)}</span>
          </div>

          {session.data && (
            <div>
              <button className=" small-button w-full">Zarezerwuj</button>
            </div>
          )}
        </div>
      </div>

      {/* <audio
        ref={audioRef}
        src={`http://localhost:1337${url}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      /> */}
    </div>
  )
}

export default AudioPlayer
