import fetch from 'cross-fetch'
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

function makeClient() {
  const client = new ApolloClient({
    name: 'AuthClient',
    link: new HttpLink({
      uri: 'http://127.0.0.1:1337/graphql',
      fetch: fetch
    }),
    cache: new InMemoryCache()
  })

  return client
}

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(
      input: { identifier: $username, password: $password, provider: "local" }
    ) {
      jwt
      user {
        id
        username
        email
        role {
          id
          name
          description
          type
        }
      }
    }
  }
`

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt' // JSON Web Token
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const newToken = {
        ...token,
        ...user
      }

      return newToken
    },
    async session({ session, user, token }) {
      return { ...session, user: token }
    }
  },
  providers: [
    CredentialsProvider({
      id: 'strapi',
      name: 'StrapiLogin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials, req) {
        const client = makeClient()

        const response = await client.mutate({
          mutation: LOGIN,
          variables: {
            username: credentials?.username,
            password: credentials?.password
          }
        })

        if (response) {
          const data = response.data.login

          const jwt = data.jwt
          const destructuredUser = { ...data.user }

          return { jwt, ...destructuredUser }
        }

        return null
      }
    })
  ]
}
