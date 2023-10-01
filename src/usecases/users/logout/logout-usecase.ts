import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { sign, verify } from "jsonwebtoken";
import { env } from "@/env";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestLogout {
    refreshToken: string
    idUser: string
}

export class LogoutUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
    ) {}

    async execute({
        refreshToken,
        idUser
    }:IRequestLogout):Promise<void>{
        const userToken = await this.usersTokensRepository.findByUserAndToken(idUser, refreshToken)

        if(!userToken){
            throw new ResourceNotFoundError()
        }

        // deletar refresh token do banco de dados
        await this.usersTokensRepository.delete(userToken.id)

        // criar novo access token para substiuir o antigo
        // e nao retornar nada para que o usuario perca o acesso
        // total da aplicação
        const blockingToken = sign({}, env.JWT_SECRET_ACCESS_TOKEN, {
            subject: userToken.idUser,
            expiresIn: env.JWT_EXPIRES_IN_ACCESS_TOKEN
        })
    
    }
}