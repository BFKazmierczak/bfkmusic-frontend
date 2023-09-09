'use client'

import { useEffect, useRef, useState } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from './AudioSlider/AudioSlider'
import { useSession } from 'next-auth/react'
import { useGlobalPlayer } from '../Providers/GlobalPlayerProvider'
import { SongEntity } from '@/src/gql/graphql'

interface AudioPlayerProps {
  song: SongEntity
  name: string
  url: string
}

const AudioPlayer = ({ song, name, url }: AudioPlayerProps) => {
  const session = useSession()

  const { songData, play, pause, playing, playSong, currentTime, duration } =
    useGlobalPlayer()

  const audioRef = useRef<HTMLAudioElement>(null)

  const [localPlaying, setLocalPlaying] = useState<boolean>(false)
  const [innerTime, setInnerTime] = useState<number>(0)
  const [innerFormattedTime, setInnerFormattedTime] = useState<string>('0:00')

  useEffect(() => {
    if (songData?.id === song.id) {
      setInnerTime(currentTime)
      setInnerFormattedTime(formatTime(currentTime))
    }
  }, [currentTime])

  useEffect(() => {
    if (songData?.id === song.id) {
      if (playing) setLocalPlaying(true)
      else if (!playing) setLocalPlaying(false)
    }
  }, [playing])

  useEffect(() => {
    if (songData?.id !== song.id) setLocalPlaying(false)
    else setLocalPlaying(true)
  }, [songData])

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className=" flex flex-row bg-neutral-300 w-72 sm:w-96 ">
      <div className=" h-full aspect-square bg-neutral-700">
        <div className=" flex justify-center items-center w-full h-full text-white bg-pink-600">
          {localPlaying ? (
            <div
              onClick={() => {
                pause()
              }}>
              <PauseIcon style={{ fontSize: '3rem' }} />
            </div>
          ) : (
            <div
              onClick={() => {
                const time = innerTime > 0 ? innerTime : undefined

                playSong(song, time)
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
            totalTime={duration}
            currentTime={innerTime}
            onTimeChange={(newTime) => {
              if (audioRef.current) {
                audioRef.current.currentTime = newTime
              }
            }}
          />

          <div>
            <span>{innerFormattedTime} /</span>
            <span>
              {formatTime(
                song.attributes?.audio?.data[0].attributes?.provider_metadata
              )}
            </span>
          </div>

          {session.data && (
            <div>
              <button className=" small-button w-full">Zarezerwuj</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
