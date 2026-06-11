// 對應後端 __Model__DTO。欄位請與 Database/schema.sql + __Model__DTO.java 保持一致。
export interface __Model__ {
    id: string
    // TODO: 對應後端 DTO 補欄位（範例保留 name）
    name: string
    createdAt: string
    updatedAt: string
}

// 對應 __Model__CreateCommand
export interface __Model__CreateDTO {
    name: string
}

// 對應 __Model__UpdateCommand
export interface __Model__UpdateDTO {
    name: string
}
