import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        token?: string
        user?: {
            userId?: string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string
        accessToken?: string
        email?: string
    }
}

// Extend @sidebase/nuxt-auth local provider SessionData
// to match what server/api/auth/session.get.ts returns
declare module '#auth' {
    interface SessionData {
        user?: {
            id?: string | null
            email?: string | null
            name?: string | null
            image?: string | null
        } | null
        token?: string | null
    }
}
