'use client'

import { useState } from 'react'
import { SongEntity, UploadFileEntity } from '@/src/gql/graphql'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface SongVersionProps {
  song: SongEntity
  audio: UploadFileEntity
}

const SongVersion = ({ song, audio }: SongVersionProps) => {
  const [localPlaying, setLocalPlaying] = useState<boolean>(false)

  const playSong = () => {}
  const pause = () => {}

  return (
    <>
      <div className=" bg-neutral-200">
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
              //   const time = innerTime > 0 ? innerTime : undefined
              //   playSong(song, time)
            }}>
            <PlayArrowIcon style={{ fontSize: '3rem' }} />
          </div>
        )}

        <span>{audio.attributes?.name}</span>
      </div>
    </>
  )
}

export default SongVersion
