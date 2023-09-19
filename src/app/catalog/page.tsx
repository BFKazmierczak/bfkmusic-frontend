import { getClient } from '@/lib/client'
import AudioPlayer from '@/src/components/Media/AudioPlayer'
import SongList from '@/src/components/Media/SongList'
import { graphql } from '@/src/gql'
import { SongEntity, SongEntityResponseCollection } from '@/src/gql/graphql'
import { SongsResult } from '@/src/interfaces/SongsResult'
import { ApolloQueryResult, gql } from '@apollo/client'

const GET_SONGS = graphql(`
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
                duration
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

const CatalogPage = async () => {
  const result = await getClient().query({
    query: GET_SONGS,
    variables: {
      pagination: {
        page: 1,
        pageSize: 10
      }
    }
  })

  const songs = result.data.songs?.data as SongEntity[]

  return (
    <>
      <SongList initialSongs={songs} />
    </>
  )
}

export default CatalogPage
