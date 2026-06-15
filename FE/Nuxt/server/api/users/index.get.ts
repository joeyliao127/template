// GET /api/users — 代理到 Spring Boot 的分頁使用者列表
export default defineEventHandler(async (event) => {
    const session = event.context.session
    const config = useRuntimeConfig()
    const query = getQuery(event)

    return await backendFetch(`${config.AUTH_API}/users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
        query,
    })
})
