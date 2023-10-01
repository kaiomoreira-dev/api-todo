import { ITodosRepository } from "@/repositories/interface-todos-repository";
import { Todo } from "@prisma/client";

interface IRequestListTodo{
    idUser: string
}

interface IResponseListTodo{
    todos: Todo[]
}

export class ListTodoByUserUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        idUser,
    }:IRequestListTodo): Promise<IResponseListTodo>{
       const todos = await this.todosRepository.list(idUser)

       return {
        todos
       }        
    }
}