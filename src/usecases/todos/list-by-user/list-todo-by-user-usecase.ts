import { ITodosRepository } from "@/repositories/interface-todos-repository";
import { Todo } from "@prisma/client";

interface IRequestListTodo{
    idUser: string
}

export class ListTodoByUserUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        idUser,
    }:IRequestListTodo): Promise<Todo[]>{
       const todos = await this.todosRepository.list(idUser)

       return todos 
    }
}