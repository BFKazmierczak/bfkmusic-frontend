'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { SongEntity } from '@/src/gql/graphql'
import { useGlobalPlayer } from '../../Providers/GlobalPlayerProvider'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from '../AudioSlider/AudioSlider'

interface SongPlayerProps {
  song: SongEntity
  audioIndex?: number
  children: ReactNode
}

const SongPlayer = ({ song, audioIndex = 0, children }: SongPlayerProps) => {
  const {
    songData,
    pause,
    playing,
    playSong,
    changeTime,
    currentTime,
    source
  } = useGlobalPlayer()

  const [localPlaying, setLocalPlaying] = useState<boolean>(false)
  const [innerTime, setInnerTime] = useState<number>(0)
  const [innerFormattedTime, setInnerFormattedTime] = useState<string>('0:00')

  const audioDuration = song.attributes?.audio?.data[audioIndex].attributes
    ?.duration as number

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  useEffect(() => {
    if (thisPlaying) {
      if (playing) setLocalPlaying(true)
      else setLocalPlaying(false)
    }
  }, [playing])

  useEffect(() => {
    if (thisPlaying) {
      setInnerTime(currentTime)
      setInnerFormattedTime(formatTime(currentTime))
    }
  }, [currentTime])

  useEffect(() => {
    console.log('Source:', source)

    const innerSsource =
      song.attributes?.audio?.data[audioIndex].attributes?.url

    console.log('innerSource:', innerSsource)

    if (thisPlaying) setLocalPlaying(true)
    else setLocalPlaying(false)
  }, [source])

  const thisPlaying = useMemo(() => {
    return song.attributes?.audio?.data[audioIndex].attributes?.url === source
  }, [source])

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

                playSong(song, time, audioIndex)
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
            totalTime={audioDuration}
            currentTime={innerTime}
            onTimeChange={(newTime) => {
              changeTime(newTime)
            }}
          />

          <div>
            <span>{innerFormattedTime} /</span>
            <span>{formatTime(audioDuration)}</span>
          </div>

          {/* {session.data && mode === 'overview' && (
            <div>
              <button
                className=" small-button w-full"
                onClick={() => router.push(`/song/${song.id}`)}>
                Pokaż szczegóły
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default SongPlayer
