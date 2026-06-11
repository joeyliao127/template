// DELETE /api/__resource__/:id — 代理刪除
export default defineEventHandler(async (event) => {
    const session = event.context.session
    const config = useRuntimeConfig()
    const id = getRouterParam(event, 'id')

    return await backendFetch(`${config.AUTH_API}/__resource__/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    })
})
