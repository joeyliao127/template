// PUT /api/__resource__/:id — 代理更新
export default defineEventHandler(async (event) => {
    const session = event.context.session
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    return await backendFetch(`${config.AUTH_API}/__resource__/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
        body,
    })
})
