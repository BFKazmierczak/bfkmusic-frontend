'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { SongEntity } from '@/src/gql/graphql'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from '../AudioSlider/AudioSlider'
import useHighlightStore from '../../../stores/highlightStore'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import formatTime from '@/src/utils/formatTime'

export interface SongPlayerProps {
  song: SongEntity
  audioIndex?: number
  size?: 'small' | 'normal'
  children?: ReactNode
}

const SongPlayer = ({
  song,
  audioIndex = 0,
  size = 'normal',
  children
}: SongPlayerProps) => {
  const {
    songData,
    pause,
    playing,
    playSong,
    changeTime,
    currentTime,
    source
  } = useGlobalPlayerStore()

  const { highlight } = useHighlightStore()

  const [localPlaying, setLocalPlaying] = useState<boolean>(false)
  const [innerTime, setInnerTime] = useState<number>(0)
  const [innerFormattedTime, setInnerFormattedTime] = useState<string>('0:00')

  const audioDuration = useMemo((): number => {
    const data = song.attributes?.audio?.data[audioIndex]

    if (data) return data.attributes?.duration as number
    else return 0
  }, [song])

  const file = song.attributes?.audio?.data[audioIndex]

  useEffect(() => {
    console.log('HIGHLIGHT:', highlight)
  }, [highlight])

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
    <div className=" flex flex-row bg-neutral-300 w-full sm:w-96 z-[7 0] ">
      <div
        className={` h-full ${
          size === 'normal' && 'aspect-square'
        } bg-neutral-700`}>
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

      <div
        className={` flex flex-col gap-y-2 w-fit p-3 overflow-x-hidden ${
          size === 'small' && 'items-center'
        } `}>
        <div>
          <span
            className=" flex w-fit bg-purple-500"
            style={{
              whiteSpace: 'nowrap',
              display: 'flex',
              overflow: 'auto'
            }}>
            {song.attributes?.audio?.data[audioIndex].attributes?.name}
          </span>
        </div>

        <>
          <AudioSlider
            totalTime={audioDuration}
            currentTime={innerTime}
            highlight={
              highlight[1] === Number(file?.id) ? highlight[0] : undefined
            }
            onTimeChange={(newTime) => {
              console.log('time change!')
              changeTime(newTime)
            }}
          />
        </>

        {size !== 'small' && (
          <div>
            <span>{innerFormattedTime} /</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        )}

        {children}
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
  )
}

export default SongPlayer
