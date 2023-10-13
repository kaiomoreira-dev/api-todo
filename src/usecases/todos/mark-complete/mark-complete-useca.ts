import { ITodosRepository } from "@/repositories/interface-todos-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestCountTodo{
    id: string
    value: boolean
}

export class MarktTodoCompletedUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        id,
        value
    }:IRequestCountTodo): Promise<void>{
        const todo = await this.todosRepository.findById(id)

        if(!todo){
            throw new ResourceNotFoundError()
        }

        if(value){
            await this.todosRepository.markCompletedTrue(id, value)
            return
        }
      
        // atualizar todo para completed true
        await this.todosRepository.markCompletedTrue(id, value)
    }
}