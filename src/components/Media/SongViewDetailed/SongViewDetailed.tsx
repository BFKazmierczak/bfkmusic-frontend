'use client'

import { SongEntity } from '@/src/gql/graphql'

import SongPlayerAction from '../SongPlayerAction/SongPlayerAction'

interface SongHistoryProps {
  song: SongEntity
}

const SongViewDetailed = ({ song }: SongHistoryProps) => {
  return (
    <>
      <SongPlayerAction song={song} />

      <span>Starsze wersje tego utworu:</span>

      <div className=" flex flex-col gap-y-3 w-full">
        {song.attributes?.audio?.data.map((audio, index) => {
          if (index > 0)
            return <SongPlayerAction song={song} audioIndex={index} />
        })}
      </div>
    </>
  )
}

export default SongViewDetailed
