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
  changeSong: (newSongData: SongEntity) => void
}

const GlobalPlayerContext = createContext<GlobalPlayerContextType>({
  songData: undefined,
  playing: false,
  play: () => {},
  pause: () => {},
  changeSong: () => {}
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

  const [source, setSource] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement>(null)

  const play = () => {
    audioRef.current?.play()
    setPlaying(true)
  }

  const pause = () => {
    if (!audioRef.current?.paused) {
      audioRef.current?.pause()
      setPlaying(false)
    }
  }

  const changeSong = (newSongData: SongEntity) => setSongData(newSongData)

  const value: GlobalPlayerContextType = {
    songData,
    playing,
    play,
    pause,
    changeSong
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
  //   if (playing) {
  //     console.log('src:', audioRef.current?.src)
  //     audioRef.current?.play()
  //   } else if (!audioRef.current?.paused) audioRef.current?.pause()
  // }, [playing])

  useEffect(() => {
    if (songData) {
      console.log('new song data:', songData)

      const url = songData.attributes?.audio?.data[0].attributes?.url
      setSource(`http://localhost:1337${url}`)
    }
  }, [songData])

  useEffect(() => {
    console.log('new src:', source)
    if (source.length > 0) play()
  }, [source])

  return (
    <GlobalPlayerContext.Provider value={value}>
      {children}

      <audio
        ref={audioRef}
        src={source}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
    </GlobalPlayerContext.Provider>
  )
}
