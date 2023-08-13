import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    jwt: string
    user: {
      id: number
      username: string
      email: string
      role: {
        id: string
        name: string
        description: string
        type: string
      }
    }
  }
}
