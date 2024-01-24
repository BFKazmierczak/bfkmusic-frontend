'use client'

import getToken from '@/src/actions/getToken'
import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

function makeClient(token: string) {
  const httpLink = new HttpLink({
    uri: 'http://127.0.0.1:1337/graphql',
    fetch,
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  console.log({ httpLink })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            httpLink
          ])
        : httpLink
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const session = useSession()

  useEffect(() => {
    console.log({ session })
  }, [session])

  return (
    <>
      {session.status !== 'loading' ? (
        <ApolloNextAppProvider
          makeClient={() => makeClient(session.data?.user?.jwt)}>
          {children}
        </ApolloNextAppProvider>
      ) : (
        <></>
      )}
    </>
  )
}
