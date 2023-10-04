import { getClient } from '@/lib/client'
import { graphql } from '@/src/gql'

import SongViewDetailed from '@/src/components/Media/SongViewDetailed/SongViewDetailed'
import { gql } from '@apollo/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
                duration
                url
                previewUrl
                provider
                provider_metadata
                createdAt
                updatedAt
                waveform {
                  data {
                    id
                    attributes {
                      peaks
                    }
                  }
                }
              }
            }
          }
          comments {
            data {
              id
              attributes {
                fileId
                content
                timeRange
                createdAt
                updatedAt
                publishedAt
                user {
                  data {
                    id
                    attributes {
                      username
                    }
                  }
                }
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
  const session = await getServerSession(authOptions)

  if (session) {
    const songQuery = await getClient().query({
      query: GET_SONG,
      variables: {
        id: params.songId
      }
    })

    const songData = songQuery.data.song?.data

    console.log(songData?.attributes?.comments?.data)

    if (!songData)
      return (
        <div className=" flex justify-center items-center  bg-red-500">
          Nie odnaleziono utworu
        </div>
      )

    return (
      <>
        <div className=" flex flex-col items-center justify-center gap-y-5">
          <span className=" font-bold text-lg">
            {songData.attributes?.name}
          </span>

          <SongViewDetailed song={songData} />
        </div>
      </>
    )
  } else {
  }
}

export default SongPage
