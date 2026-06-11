import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const raw = getCookie(event, config.public.SESSION_COOKIE)

    const session = await useStorage('redis').getItem(raw || '')
    if (!session) {
        return { user: null, token: null }
    }

    try {
        return typeof session === 'string' ? JSON.parse(session) : session
    } catch {
        return { user: null, token: null }
    }
})
