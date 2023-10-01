import { IUsersRepository } from "@/repositories/interface-users-repository";
import { User } from "@prisma/client";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";

interface IRequestUpdateUser {
    id: string,
    email: string,
    name: string,
}
interface IResponseUpdateUser {
    user: User
}

export class UpdateUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id,
        email,
        name,
    }:IRequestUpdateUser):Promise<IResponseUpdateUser>{
        const findUserExists = await this.usersRepository.findById(id)

        if(!findUserExists){
            throw new ResourceNotFoundError()
        }


        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists && findUserExists.email !== email){
            throw new EmailAlreadyExistsError()
        }


        const user = await this.usersRepository.update({
            id,
            email,
            name,
        })

        const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            emailActive: user.emailActive,
            createdAt: user.createdAt,
        } as User

        return {
            user: userInfo
        }
    }
}