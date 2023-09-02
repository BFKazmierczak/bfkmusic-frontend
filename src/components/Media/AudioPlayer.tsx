'use client'

import { useEffect, useRef, useState } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from './AudioSlider/AudioSlider'

interface AudioPlayerProps {
  name: string
  url: string
}

const AudioPlayer = ({ name, url }: AudioPlayerProps) => {
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
    <div className=" flex flex-row items-center bg-neutral-300 gap-x-5 w-72 pr-5">
      <div className=" p-5 text-white bg-pink-600">
        {playing ? (
          <div onClick={() => setPlaying(false)}>
            <PauseIcon style={{ fontSize: '2.5rem' }} />
          </div>
        ) : (
          <div onClick={() => setPlaying(true)}>
            <PlayArrowIcon style={{ fontSize: '2.5rem' }} />
          </div>
        )}
      </div>

      <div className=" flex flex-col gap-y-2 w-full">
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
      </div>

      <audio
        ref={audioRef}
        src={`http://localhost:1337${url}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
    </div>
  )
}

export default AudioPlayer
