import { ITodosRepository } from "@/repositories/interface-todos-repository";

interface IRequestCountTodoReady{
    idUser: string
}

interface IResponseCountTodoReady{
    count: number
}


export class CountTodoReadyUseCase{
    constructor(
        private todosRepository: ITodosRepository
    ){}
    
    async execute({
        idUser,
    }:IRequestCountTodoReady): Promise<IResponseCountTodoReady>{
        const count = await this.todosRepository.countAllReadyByUserId(idUser)

        return { 
            count 
        }
      
    }
}