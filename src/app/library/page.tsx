import { getClient } from '@/lib/client'
import { SongLibrary } from '@/src/components/Media/SongLibrary'
import SongList from '@/src/components/Media/SongList'
import SongPlayer from '@/src/components/Media/SongPlayer/SongPlayer'
import { graphql } from '@/src/gql'
import { SongEntity } from '@/src/gql/graphql'
import { gql } from '@apollo/client'

const GET_LIBRARY = graphql(`
  query GetLibrary($pagination: PaginationArg) {
    songs(pagination: $pagination) {
      data {
        id
        attributes {
          createdAt
          updatedAt
          publishedAt
          name
          description
          inLibrary
          audio {
            data {
              id
              attributes {
                createdAt
                updatedAt
                name
                url
                duration
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
        }
      }
    }
  }
`)

const LibraryPage = async () => {
  const result = await getClient().query({
    query: GET_LIBRARY,
    variables: {
      pagination: {
        page: 1,
        pageSize: 10
      }
    }
  })

  const songs = result.data.songs?.data as SongEntity[]

  return (
    <div className=" flex flex-col gap-y-5">
      <h1 className=" mt-5">Moja biblioteka</h1>
      <div className=" flex flex-col gap-y-5">
        <SongLibrary initialSongs={songs} />
      </div>
    </div>
  )
}

export default LibraryPage
