import { IUsersRepository } from "@/repositories/interface-users-repository";
import 'dotenv/config'

interface IRequestFindUser {
   email: string
}

export class EmailVerifyUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        email
    }:IRequestFindUser):Promise<boolean>{
        // encontrar usuario pelo email
        const findUserExist = await this.usersRepository.findByEmail(email)

        // validar se usuario existe
        if(findUserExist){
            return true
        }

        return false
    }
}