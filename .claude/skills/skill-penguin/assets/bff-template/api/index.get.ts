// GET /api/__resource__ — 代理到 Spring Boot 的分頁列表
export default defineEventHandler(async (event) => {
    const session = event.context.session
    const config = useRuntimeConfig()
    const query = getQuery(event)

    return await backendFetch(`${config.AUTH_API}/__resource__`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
        query,
    })
})
