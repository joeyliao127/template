import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const sessionId = getCookie(event, config.public.SESSION_COOKIE)

    await useStorage('redis').removeItem(sessionId as string)
    return { result: true }
})
