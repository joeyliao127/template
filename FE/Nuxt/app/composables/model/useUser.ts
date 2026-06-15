import type { Pagination } from '~~/types'
import type { User } from '~~/types/User'

// MVVM model 層:唯一允許發 fetch 的地方。
// page 的 <script> 不可直接 fetch,一律透過此 composable 取資料。
export function useUser() {
    const list = (query: Record<string, unknown> = {}) =>
        $fetch<Pagination<User>>('/api/users', { query })

    return { list }
}
