import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        email?: string
        password?: string
        username?: string
    }>(event)

    const email = body?.email
    const password = body?.password
    const username = body?.username

    if (!email || !password || !username) {
        throw createError({
            statusCode: 400,
            statusMessage: '缺少 email、password 或 username',
        })
    }

    const runtimeConfig = useRuntimeConfig()
    const apiBase = runtimeConfig.AUTH_API

    try {
        await backendFetch(`${apiBase}/users/signUp`, {
            method: 'POST',
            body: { email, password, username },
        })

        return { result: true, message: '註冊成功' }
    } catch (error: unknown) {
        const err = error as { response?: { status?: number }; statusCode?: number; data?: { message?: string }; message?: string }
        const statusCode = err?.response?.status || err?.statusCode || 500
        const statusMessage = err?.data?.message || err?.message || '註冊失敗，請稍後再試'

        throw createError({
            statusCode,
            statusMessage,
        })
    }
})
