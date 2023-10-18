import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";
import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { hash } from "bcrypt";
import { User } from "@prisma/client";
import { IEthrealProvider } from "@/providers/MailProvider/interface-ethreal-provider";

interface IRequestResetPassword {
    token: string
    password: string
}

export class ResetPasswordUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        token,
        password
    }:IRequestResetPassword):Promise<void>{
        // buscar token no banco
        const findToken = await this.usersTokensRepository.findByToken(token)

        // verifica se token foi encontrado
        if(!findToken){
            throw new ResourceNotFoundError()
        }

        // verificar se o token está expirado
        if  (
                this.dayjsDateProvider.compareIfBefore
                (
                    findToken.expireDate as Date, 
                    this.dayjsDateProvider.dateNow()
                )
            )
            {
                throw new AccessTimeOutError()
            }


        // buscar usuário no banco
        const user = await this.usersRepository.findById(findToken.idUser) as User

        // criptografar senha
        const newPassword = await hash(password, 8)

        // cira nova senha do usuario
        await this.usersRepository.changePassword(user.id, newPassword)

        // deletar token do banco
        await this.usersTokensRepository.delete(findToken.id)
    }
}