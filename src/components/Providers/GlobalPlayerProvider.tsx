'use client'

import { SongEntity } from '@/src/gql/graphql'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

interface GlobalPlayerProviderProps {
  children: ReactNode
}

interface GlobalPlayerContextType {
  songData: SongEntity | undefined
  playing: boolean
  play: () => void
  pause: () => void
  playSong: (newSongData: SongEntity, time?: number) => void
  changeTime: (newTime: number) => void
  currentTime: number
  currentFormattedTime: string
  duration: number
}

const GlobalPlayerContext = createContext<GlobalPlayerContextType>({
  songData: undefined,
  playing: false,
  play: () => {},
  pause: () => {},
  playSong: () => {},
  changeTime: () => {},
  currentTime: 0,
  currentFormattedTime: '',
  duration: 0
})

export const useGlobalPlayer = () => {
  return useContext(GlobalPlayerContext)
}

export const GlobalPlayerProvider = ({
  children
}: GlobalPlayerProviderProps) => {
  const [songData, setSongData] = useState<SongEntity>()
  const [playing, setPlaying] = useState<boolean>(false)

  const [currentTime, setCurrentTime] = useState<number>(0)
  const [currentFormattedTime, setCurrentFormattedTime] = useState<string>('')

  const [duration, setDuration] = useState<number>(0)

  const [source, setSource] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement>(null)

  const value: GlobalPlayerContextType = {
    songData,
    playing,
    play,
    pause,
    playSong,
    changeTime,
    currentTime,
    currentFormattedTime,
    duration
  }

  function play() {
    audioRef.current?.play()
    setPlaying(true)
  }

  function pause() {
    if (!audioRef.current?.paused) {
      audioRef.current?.pause()
      setPlaying(false)
    }
  }

  function playSong(
    newSongData: SongEntity,
    time?: number,
    audioIndex?: number
  ) {
    if (time) setCurrentTime(time)
    else setCurrentTime(0)

    if (newSongData.id === songData?.id) {
      play()
    } else {
      const index = audioIndex || 0

      const url = newSongData.attributes?.audio?.data[index].attributes?.url

      setSource(`http://localhost:1337${url}`)
      setSongData(newSongData)
    }
  }

  function changeTime(newTime: number) {
    if (audioRef.current) audioRef.current.currentTime = newTime
  }

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

  // useEffect(() => {
  //   if (songData) {
  //     const url = songData.attributes?.audio?.data[0].attributes?.url

  //     setSource(`http://localhost:1337${url}`)
  //   }
  // }, [songData])

  useEffect(() => {
    if (source.length > 0 && audioRef.current) {
      if (currentTime > 0) {
        audioRef.current.currentTime = currentTime
      }
      play()
    }
  }, [source])

  useEffect(() => {
    if (audioRef.current && audioRef.current.src) {
      const duration = audioRef.current.duration

      if (!Number.isNaN(duration)) {
        setDuration(duration)
      }
    }
  }, [audioRef.current?.src, audioRef.current?.duration])

  return (
    <GlobalPlayerContext.Provider value={value}>
      {children}

      <audio
        ref={audioRef}
        src={source}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setPlaying(false)
          setCurrentTime(0)
        }}
      />
    </GlobalPlayerContext.Provider>
  )
}
