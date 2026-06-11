import type { Pagination } from '~~/types'
import type { __Model__, __Model__CreateDTO, __Model__UpdateDTO } from '~~/types/__Model__'

// MVVM model 層：唯一允許發 fetch 的地方。
// page 的 <script> 不可直接 fetch，一律透過此 composable 取資料 / 改資料。
export function use__Model__() {
    const list = (query: Record<string, unknown> = {}) =>
        $fetch<Pagination<__Model__>>('/api/__resource__', { query })

    const get = (id: string) =>
        $fetch<__Model__>(`/api/__resource__/${id}`)

    const create = (payload: __Model__CreateDTO) =>
        $fetch<__Model__>('/api/__resource__', { method: 'POST', body: payload })

    const update = (id: string, payload: __Model__UpdateDTO) =>
        $fetch<__Model__>(`/api/__resource__/${id}`, { method: 'PUT', body: payload })

    const remove = (id: string) =>
        $fetch<{ result: boolean; message: string }>(`/api/__resource__/${id}`, { method: 'DELETE' })

    return { list, get, create, update, remove }
}
