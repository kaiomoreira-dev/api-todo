import { ITodosRepository } from "@/repositories/interface-todos-repository";

interface IRequestCountTodo{
    idUser: string
}

interface IResponseCountTodo{
    count: number
}


export class CountAllTodoUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        idUser,
    }:IRequestCountTodo): Promise<IResponseCountTodo>{
        const count = await this.todosRepository.countAllByUserId(idUser)

        return { 
            count 
        }
      
    }
}