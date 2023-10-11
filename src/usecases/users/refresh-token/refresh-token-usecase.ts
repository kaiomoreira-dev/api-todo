import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { sign, verify } from "jsonwebtoken";
import { env } from "@/env";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { AccessTimeOutError } from '@/usecases/errors/access-time-out-error';
import { IPayload } from '@/http/middlewares/verify-token-jwt';

interface IRequestRefreshToken {
    token: string
}

interface IResponseRefreshToken {
    refreshToken?: string
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
        
        const verifyToken = this.dayjsDateProvider.compareIfBefore(
            userToken.expireDate,
            this.dayjsDateProvider.dateNow()
             
            );
        // verificar se o token está expirado
        if(verifyToken)
            {
                // deletar refresh token do banco de dados
                await this.usersTokensRepository.delete(userToken.id)
                // gerar um novo refresh token passando email no payload

                throw new AccessTimeOutError()
            }
       
        verify(token, env.JWT_SECRET_REFRESH_TOKEN) as IPayload;

        // criar novo access token
        const newAccessToken = sign({}, env.JWT_SECRET_ACCESS_TOKEN, {
            subject: userToken.idUser,
            expiresIn: env.JWT_EXPIRES_IN_ACCESS_TOKEN
        })
        
        // retornar o novo refresh token e o novo access token  
        return {
            accessToken: newAccessToken,
        }      
    }
}