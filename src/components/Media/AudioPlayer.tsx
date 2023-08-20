'use client'

import { useEffect, useRef, useState } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface AudioPlayerProps {
  name: string
  url: string
}

const AudioPlayer = ({ name, url }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (playing) audioRef.current?.play()
    else if (!audioRef.current?.paused) audioRef.current?.pause()
  }, [playing])

  return (
    <div className=" flex flex-row items-center bg-neutral-300">
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

      <div>{name}</div>
      <audio ref={audioRef} src={`http://localhost:1337${url}`}></audio>
    </div>
  )
}

export default AudioPlayer
