'use client'

import { SongEntity } from '@/src/gql/graphql'
import { useState } from 'react'
import SongPlayer from '../SongPlayer/SongPlayer'

interface SongLibraryProps {
  initialSongs: SongEntity[]
}

const SongLibrary = ({ initialSongs }: SongLibraryProps) => {
  const [songs, setSongs] = useState<SongEntity[]>(initialSongs)

  return (
    <div className=" flex flex-col gap-y-2 max-h-fit overflow-y-auto px-5 bg-green-200">
      {songs.map((song) => (
        <SongPlayer key={song.id} song={song} size="small" showMainName />
      ))}
    </div>
  )
}

export default SongLibrary
