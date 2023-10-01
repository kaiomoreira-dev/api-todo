import { Prisma, User } from "@prisma/client"

export interface IUsersRepository {
    create(data:Prisma.UserUncheckedCreateInput): Promise<User>
    list(): Promise<User[]>
    findById(id:string): Promise<User | null>
    getUserSecurity(id:string): Promise<User | null>
    findByEmail(email:string): Promise<User | null>

    activeEmail(id:string): Promise<void>
    changePassword(id:string, password:string): Promise<void | null>
    update(data:Prisma.UserUncheckedUpdateInput): Promise<User>
    delete(id:string): Promise<void>
}