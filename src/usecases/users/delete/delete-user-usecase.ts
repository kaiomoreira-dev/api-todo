import { IUsersRepository } from "@/repositories/interface-users-repository";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestDeleteUser {
   id: string
}

export class DeleteUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id
    }:IRequestDeleteUser):Promise<void>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(id)

        // validar se usuario existe
        if(!findUserExist){
            throw new ResourceNotFoundError()
        }

        // delete user
        await this.usersRepository.delete(id)
    }
}