import { headers } from 'next/headers'
import { HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient
} from '@apollo/experimental-nextjs-app-support/ssr'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import fetch from 'cross-fetch'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || 'http://127.0.0.1:1337/graphql'

const httpLink = new HttpLink({
  uri: 'http://127.0.0.1:1337/graphql'
})

const authLink = setContext(async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.jwt) return {}

  return {
    headers: {
      authorization: `Bearer ${session.user.user.jwt}`
    }
  }
})

export const { getClient } = registerApolloClient(
  () =>
    new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      link: authLink.concat(httpLink)
    })
)
