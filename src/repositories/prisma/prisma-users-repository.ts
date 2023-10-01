import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { prisma } from "@/lib/prisma-client";

export class PrismaUsersRepository implements IUsersRepository{
    async getUserSecurity(id: string){
        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                email: true,
                emailActive: true,
                createdAt: true,
                todos: true
            }
        }) as unknown as User
        return user
    }
    async changePassword(id: string, password: string){
        await prisma.user.update({
            where: {
                id
            },
            data:{
                password
            }
        })
    }
    async create(data: Prisma.UserUncheckedCreateInput){
        const user = await prisma.user.create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                emailActive: true,
                createdAt: true,
                todos: true
            }
        }) as unknown as User
        
        return user
    }

    async list(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailActive: true,
                createdAt: true,
                todos: true
            }
        }) as unknown as User[]
        return users
    }

    async findById(id: string){
        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                emailActive: true,
                createdAt: true,
                todos: true
            }
        }) as unknown as User
        return user
    }

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                emailActive: true,
                createdAt: true,
                todos: true
            }
        }) as unknown as User

        return user
    }

    async activeEmail(id: string){
       await prisma.user.update({
            where: {
                id
            },
            data:{
                emailActive: true
            },
           
        })
    }

    async update(data: Prisma.UserUncheckedUpdateInput){
        const user = await prisma.user.update({
            where: {
                id: data.id as string
            },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                emailActive: true,
                createdAt: true,
                todos: true
            }
        }) as unknown as User

        return user
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id
            }
        })
    }
}