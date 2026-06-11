// POST /api/__resource__ — 代理建立
export default defineEventHandler(async (event) => {
    const session = event.context.session
    const config = useRuntimeConfig()
    const body = await readBody(event)

    return await backendFetch(`${config.AUTH_API}/__resource__`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
        body,
    })
})
