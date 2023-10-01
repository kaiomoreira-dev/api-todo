import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { sign, verify } from "jsonwebtoken";
import { env } from "@/env";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { AccessTimeOutError } from '@/usecases/errors/access-time-out-error';

export interface IPayload {
    subject: string
    email: string
}

interface IRequestRefreshToken {
    token: string
}

interface IResponseRefreshToken {
    refreshToken: string
    accessToken: string
}

export class RefreshTokenUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        token,
    }:IRequestRefreshToken):Promise<IResponseRefreshToken>{
        const userToken = await this.usersTokensRepository.findByToken(token)

        if(!userToken){
            throw new ResourceNotFoundError()
        }

        // verificar se o token está expirado
        if  (
            this.dayjsDateProvider.compareIfBefore
            (
                userToken.expireDate, 
                this.dayjsDateProvider.dateNow()
            )
            )
            {
                throw new AccessTimeOutError()
            }

        // pegar email e id do usuário pelo token através do verify
        const {subject, email} = verify(token, env.JWT_SECRET_REFRESH_TOKEN) as IPayload

        // variavel para armazenar o id do usuário
        const idUser = subject

        // deletar refresh token do banco de dados
        await this.usersTokensRepository.delete(userToken.id)

        // gerar um novo refresh token passando email no payload
        const newRefreshToken = sign({subject:idUser, email}, env.JWT_SECRET_REFRESH_TOKEN, {
            subject: idUser,
            expiresIn: env.JWT_EXPIRES_IN_REFRESH_TOKEN
        })

        // criar novo access token
        const newAccessToken = sign({}, env.JWT_SECRET_ACCESS_TOKEN, {
            subject: idUser,
            expiresIn: env.JWT_EXPIRES_IN_ACCESS_TOKEN
        })

         // variavel para quantidade de dais para expirar o token
         const expireDaysRrefreshToken = 10;

         // criar data de expiração do refresh token
         const refreshTokenExpiresDate = this.dayjsDateProvider.addDays(expireDaysRrefreshToken)
 
        
        // salvar refresh token no banco de dados
        await this.usersTokensRepository.create({
            idUser,
            token: newRefreshToken,
            expireDate: refreshTokenExpiresDate
        })

        // retornar o novo refresh token e o novo access token  
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }      
    }
}