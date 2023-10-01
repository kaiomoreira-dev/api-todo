import { Prisma, User} from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository{
    public users: User[] = []

    async getUserSecurity(id: string){
        const user = this.users.find(user => user.id === id)

        if(!user){
            return null
        }

        const userSecurity = {
            ...user,
            password: undefined,
        }

        return userSecurity as unknown as User;
    }
    async changePassword(id: string, password: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users[userIndex].password = password
    } 
    
    async create({
        id,
        email,
        name,
        password,
        emailActive,
    }: Prisma.UserUncheckedCreateInput) {
        const user = {
            id: id ? id : randomUUID(),
            email,
            name,
            password,
            emailActive: emailActive ? emailActive : false,
            createdAt: new Date()
            }
        
        this.users.push(user)

        return user;
    }

    async list() {
        return this.users
    }

    async findById(id: string){
        const user = this.users.find(user => user.id === id)

        if(!user){
            return null
        }

        return user;
    }

    async findByEmail(email: string){
        const user = this.users.find(user => user.email === email)

        if(!user){
            return null
        }

        return user;
    }
    
    async activeEmail(id:string, activate = true) {
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users[userIndex].emailActive = activate
    }

    async update({ 
        id,
        email,
        name,
        password,
    }:Prisma.UserUncheckedUpdateInput){
        const userIndex = this.users.findIndex(user => user.id === id)
        
        this.users[userIndex].email = email as string
        this.users[userIndex].name = name as string
        this.users[userIndex].password = password as string

        return this.users[userIndex]
    }

    async delete(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users.splice(userIndex, 1)
    }
}