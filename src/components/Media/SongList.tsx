import { SongEntity } from '@/src/gql/graphql'
import SongPlayer from './SongPlayer/SongPlayer'

interface SongListProps {
  initialSongs: SongEntity[] | []
}

const SongList = ({ initialSongs }: SongListProps) => {
  return (
    <div className=" flex flex-col gap-y-5 mt-10">
      {initialSongs?.map((song) => {
        const audioData = song.attributes?.audio?.data

        if (audioData && audioData.length > 0) {
          return <SongPlayer key={song.id} song={song} />
        }
      })}
    </div>
  )
}

export default SongList
