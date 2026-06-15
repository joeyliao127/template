// 對應後端 UserDTO。欄位請與 Database/schema.sql + UserDTO.java 保持一致。
export interface User {
    id: string
    username: string
    email: string
    createdAt: string
    updatedAt: string
}

export type Povider = 'email' | 'google' | 'github'
