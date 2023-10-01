import { Prisma, Todo } from "@prisma/client";

export interface ITodosRepository {
    create(data: Prisma.TodoUncheckedCreateInput): Promise<Todo>
    list(idUser: string): Promise<Todo[]>
    findById(id: string): Promise<Todo| null>
    countAllByUserId(idUser:string): Promise<number>
    countAllReadyByUserId(idUser:string): Promise<number>
    markCompletedTrue(id: string): Promise<Todo>
    delete(id: string): Promise<void>
}