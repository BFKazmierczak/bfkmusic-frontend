import { getClient } from '@/lib/client'
import AudioPlayer from '@/src/components/Media/AudioPlayer'
import SongList from '@/src/components/Media/SongList'
import { SongsResult } from '@/src/interfaces/SongsResult'
import { ApolloQueryResult, gql } from '@apollo/client'

const GET_SONGS = gql`
  query GetSongs($pagination: PaginationArg) {
    songs(pagination: $pagination) {
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
                url
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
`

const CatalogPage = async () => {
  const result: ApolloQueryResult<SongsResult> = await getClient().query({
    query: GET_SONGS,
    variables: {
      pagination: {
        page: 1,
        pageSize: 10
      }
    }
  })
  const songs = result.data.songs.data

  return (
    <>
      <SongList initialSongs={songs} />
    </>
  )
}

export default CatalogPage
