import { SongEntity } from '@/src/gql/graphql'
import SongPlayer from './SongPlayer/SongPlayer'

interface SongListProps {
  initialSongs: SongEntity[] | undefined
}

const SongList = ({ initialSongs }: SongListProps) => {
  return (
    <div className=" flex flex-col gap-y-5 mt-10">
      {initialSongs?.map((song) => (
        <SongPlayer key={song.id} song={song} />
      ))}
    </div>
  )
}

export default SongList
