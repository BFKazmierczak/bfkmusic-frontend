import { getClient } from '@/lib/client'
import AudioPlayer from '@/src/components/Media/AudioPlayer'
import SongVersion from '@/src/components/Media/SongVersion/SongVersion'
import { graphql } from '@/src/gql'

const GET_SONG = graphql(`
  query GetSong($id: ID) {
    song(id: $id) {
      data {
        id
        attributes {
          name
          description
          audio {
            data {
              id
              attributes {
                name
                alternativeText
                caption
                width
                height
                formats
                hash
                ext
                mime
                size
                url
                previewUrl
                provider
                provider_metadata
                createdAt
                updatedAt
              }
            }
          }
          createdAt
          updatedAt
          publishedAt
        }
      }
    }
  }
`)

interface SongPageProps {
  params: {
    songId: string
  }
}

const SongPage = async ({ params }: SongPageProps) => {
  const songQuery = await getClient().query({
    query: GET_SONG,
    variables: {
      id: params.songId
    }
  })

  const songData = songQuery.data.song?.data

  console.log('song data:', songData)

  if (!songData)
    return (
      <div className=" flex justify-center items-center  bg-red-500">
        Nie odnaleziono utworu
      </div>
    )

  return (
    <>
      <div className=" flex flex-col items-center justify-center gap-y-5">
        <span className=" font-bold text-lg">{songData.attributes?.name}</span>

        <AudioPlayer song={songData} mode="details" />

        <span>Wersje tego utworu:</span>

        <div className=" flex flex-col gap-y-3">
          {songData.attributes?.audio?.data.map((audio) => {
            return <SongVersion song={songData} audio={audio} />
          })}
        </div>
      </div>
    </>
  )
}

export default SongPage
