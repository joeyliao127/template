// [...__resource__].ts — catch-all：未定義的 __resource__ 子路徑一律 403
export default defineEventHandler((event) => {
    throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
    })
})
