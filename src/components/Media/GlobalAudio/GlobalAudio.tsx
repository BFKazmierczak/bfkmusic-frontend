'use client'

import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import { useEffect, useRef, memo } from 'react'

const GlobalAudio = memo(() => {
  const { playing, setCurrent, source, endSong, setCurrentTime } =
    useGlobalPlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      console.log('new ref')

      setCurrent(audioRef.current)
    }
  }, [audioRef])

  useEffect(() => {
    if (source.length > 0 && audioRef.current) {
      if (playing) audioRef.current.play()
    }
  }, [source])

  function handleTimeUpdate() {
    if (audioRef.current) {
      const time = audioRef.current
      if (time) setCurrentTime(audioRef.current.currentTime)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={`${process.env.BACKEND_URL}${source}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => endSong()}
      />
    </>
  )
})

export default GlobalAudio
