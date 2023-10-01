import { ITodosRepository } from "@/repositories/interface-todos-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestDeleteTodo{
    id: string
}

export class DeleteTodoUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        id,
    }:IRequestDeleteTodo): Promise<void>{
        const todo = await this.todosRepository.findById(id)

        if(!todo){
            throw new ResourceNotFoundError()
        }

        await this.todosRepository.delete(id)
    }
}