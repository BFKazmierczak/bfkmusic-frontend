import { create } from 'zustand'
import { SongEntity } from '../gql/graphql'
import { RefObject } from 'react'
import formatTime from '../utils/formatTime'

type GlobalPlayerStore = {
  songData: SongEntity | undefined
  current: HTMLAudioElement | undefined
  setCurrent: (current: HTMLAudioElement) => void
  playing: boolean
  play: () => void
  pause: () => void
  playSong: (
    newSongData: SongEntity,
    time?: number,
    audioIndex?: number
  ) => void
  changeTime: (newTime: number) => void
  endSong: () => void
  currentTime: number
  setCurrentTime: (newTime: number) => void
  currentFormattedTime: string
  duration: number
  source: string
}

const useGlobalPlayerStore = create<GlobalPlayerStore>()((set) => ({
  songData: undefined,
  current: undefined,
  setCurrent: (current) => {
    set((state) => ({ current }))
  },
  playing: false,
  play: () => {},
  pause: () => {
    set((state) => {
      console.log('pausing...')
      state.current?.pause()
      return { playing: false }
    })
  },
  playSong: (newSongData, time = 0, audioIndex = 0) => {
    set((state) => {
      const newSrc =
        newSongData.attributes?.audio?.data[audioIndex].attributes?.url

      const duration =
        newSongData.attributes?.audio?.data[audioIndex].attributes?.duration

      if (state.current && newSrc) {
        state.current.src = newSrc
        state.current.currentTime = time
      }

      console.log('playing...')

      return {
        songData: newSongData,
        currentTime: time,
        source: newSrc,
        duration,
        playing: true
      }
    })
  },
  changeTime: (newTime) => {
    set((state) => {
      if (state.current) state.current.currentTime = newTime
      return {
        currentTime: newTime,
        currentFormattedTime: formatTime(newTime)
      }
    })
  },
  endSong: () =>
    set((state) => ({
      playing: false,
      currentTime: 0
    })),
  currentTime: 0,
  setCurrentTime: (newTime) => {
    set((state) => {
      return {
        currentTime: newTime,
        currentFormattedTime: formatTime(newTime)
      }
    })
  },
  currentFormattedTime: '00:00',
  duration: 0,
  source: ''
}))

export default useGlobalPlayerStore
