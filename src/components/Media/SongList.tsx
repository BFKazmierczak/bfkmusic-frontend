import { Song } from '@/src/interfaces/SongsResult'
import AudioPlayer from './AudioPlayer'
import { SongEntity } from '@/src/gql/graphql'

interface SongListProps {
  initialSongs: SongEntity[] | undefined
}

const SongList = ({ initialSongs }: SongListProps) => {
  return (
    <div className=" flex flex-col gap-y-5 mt-10">
      {initialSongs?.map((song) => (
        <AudioPlayer
          key={song.id}
          song={song}
          name={song.attributes.name}
          url={song.attributes.audio.data[0].attributes.url}
        />
      ))}
    </div>
  )
}

export default SongList
