'use client'

import { useEffect, useState } from 'react'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from './AudioSlider/AudioSlider'
import { useSession } from 'next-auth/react'
import { useGlobalPlayer } from '../Providers/GlobalPlayerProvider'
import { SongEntity } from '@/src/gql/graphql'
import { useRouter } from 'next/navigation'

interface AudioPlayerProps {
  song: SongEntity
  mode?: 'overview' | 'details'
}

const AudioPlayer = ({ song, mode = 'overview' }: AudioPlayerProps) => {
  const session = useSession()
  const router = useRouter()

  const {
    songData,
    pause,
    playing,
    playSong,
    changeTime,
    currentTime,
    duration,
    source
  } = useGlobalPlayer()

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
    if (
      songData?.id === song.id &&
      songData?.attributes?.audio?.data[0].attributes?.url === source
    ) {
      if (playing) setLocalPlaying(true)
      else if (!playing) setLocalPlaying(false)
    }
  }, [playing])

  useEffect(() => {
    if (
      source &&
      source !== songData?.attributes?.audio?.data[0].attributes?.url
    )
      setLocalPlaying(false)
  }, [source])

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
    <div className=" flex flex-row bg-neutral-300 w-80 sm:w-96 ">
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

                playSong(song, time, 0)
              }}>
              <PlayArrowIcon style={{ fontSize: '3rem' }} />
            </div>
          )}
        </div>
      </div>

      <div className=" flex justify-center w-full">
        <div className=" flex flex-col w-full gap-y-2 p-3">
          <span>{song.attributes?.name}</span>

          <AudioSlider
            totalTime={duration}
            currentTime={innerTime}
            onTimeChange={(newTime) => {
              changeTime(newTime)
            }}
          />

          <div>
            <span>{innerFormattedTime} /</span>
            {/* <span>
              {formatTime(
                song.attributes?.audio?.data[0].attributes
              )}
            </span> */}
          </div>

          {session.data && mode === 'overview' && (
            <div>
              <button
                className=" small-button w-full"
                onClick={() => router.push(`/song/${song.id}`)}>
                Pokaż szczegóły
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
