import { Prisma } from "@prisma/client";
import { ITodosRepository } from "../interface-todos-repository";
import { prisma } from "@/lib/prisma";

export class PrismaTodosRepository implements ITodosRepository{
    async create(data: Prisma.TodoUncheckedCreateInput){
        const todo = await prisma.todo.create({ data });

        return todo;
    }

    async list(idUser: string){
        return await prisma.todo.findMany({
            where: {
                idUser
            },
            orderBy:{
                createdAt: 'asc'
            }
        })
    }

    async findById(id: string){
        const todo = await prisma.todo.findUnique({
            where: {
                id
            }
        })

        return todo
    }

    async countAllByUserId(idUser: string){
        const count = await prisma.todo.count({ where: { idUser } })

        return count
    }

    async countAllReadyByUserId(idUser: string){
        const count = await prisma.todo.count({ where: { idUser, completed: true } })

        return count
    }

    async markCompletedTrue(id: string){
        const todo = await prisma.todo.update({
            where: {
                id
            },
            data:{
                completed: true
            }
        })

        return todo
    }

    async delete(id: string){
        await prisma.todo.delete({
            where: {
                id
            }
        })
    }
    
}