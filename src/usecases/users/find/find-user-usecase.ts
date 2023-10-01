import { IUsersRepository } from "@/repositories/interface-users-repository";
import { User } from "@prisma/client";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestFindUser {
   id: string
}
interface IResponseFindUser {
    user: User
}

export class FindUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id
    }:IRequestFindUser):Promise<IResponseFindUser>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.getUserSecurity(id)

        // validar se usuario existe
        if(!findUserExist){
            throw new ResourceNotFoundError()
        }

        // retornar usuario
        return {
            user: findUserExist
        }
    }
}