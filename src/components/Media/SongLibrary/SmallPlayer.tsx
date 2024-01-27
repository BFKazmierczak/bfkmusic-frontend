import { SongEntity } from '@/src/gql/graphql'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface SmallPlayerProps {
  song: SongEntity
  playing: boolean
  onPause: () => void
}

const SmallPlayer = ({ song, playing, onPause }: SmallPlayerProps) => {
  return (
    <div className=" flex gap-x-1">
      {playing ? (
        <div
          onClick={() => {
            onPause()
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
      <span>{song.attributes?.name}</span>
    </div>
  )
}

export default SmallPlayer
