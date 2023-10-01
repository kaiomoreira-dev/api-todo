import { ITodosRepository } from "@/repositories/interface-todos-repository";
import { Todo } from "@prisma/client";

interface IRequestCreateTodo{
    description: string
    idUser: string
}

interface IResponseCreateTodo{
    todo: Todo
}


export class CreateTodoUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        idUser,
        description
    }:IRequestCreateTodo): Promise<IResponseCreateTodo>{
        const todo = await this.todosRepository.create({
            description,
            idUser
        })

        return { 
            todo 
        }
    }
}