// [...users].ts — catch-all:未定義的 users 子路徑一律 403
export default defineEventHandler(() => {
    throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
    })
})
