// 集中封裝對後端 Spring Boot API 的代理請求。
//
// nitro 的 typed $fetch 會對 InternalApi route 做型別比對，在 TypeScript 6 下
// 展開過深（TS2321 Excessive stack depth）。這裡把 $fetch 斷言成簡單函式型別
// 一次繞過，避免 server/api 下 ~28 個 BFF proxy handler 各自處理型別問題；
// 明確的 Promise<unknown> 回傳型別也順帶斷開 handler 回傳型別的自我循環推導。
export function backendFetch(request: string, options?: Record<string, unknown>): Promise<unknown> {
    const rawFetch = $fetch as unknown as (request: string, options?: Record<string, unknown>) => Promise<unknown>
    return rawFetch(request, options)
}
