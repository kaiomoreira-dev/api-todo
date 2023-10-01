import { env } from "@/env";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { CredentialsInvalidError } from "@/usecases/errors/credentials-invalid-error";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { IPayload } from "../refresh-token/refresh-token-usecase";

interface IRequestLoginAccount {
    email: string,
    password: string,
}
export interface IResponseLoginAccount {
    accessToken: string
    refreshToken: string
    user: User
}

export class LoginUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider
    ) {}

    async execute({
        email,
        password
    }:IRequestLoginAccount):Promise<IResponseLoginAccount>{

        let findUserExists = await this.usersRepository.findByEmail(email)
        if(!findUserExists){
            throw new CredentialsInvalidError()
        }

        // comparar senha
        const passwordMatch = await compare(password, findUserExists.password)

        if(!passwordMatch){
            throw new CredentialsInvalidError()
        }
        
       
        // Criar access token
        const accessToken = jwt.sign({}, env.JWT_SECRET_ACCESS_TOKEN, {
            subject: findUserExists.id,
            expiresIn: env.JWT_EXPIRES_IN_ACCESS_TOKEN
        }) 
       
        // Criar refresh token
        const refreshToken = jwt.sign({subject:findUserExists.id, email}, env.JWT_SECRET_REFRESH_TOKEN, {
            subject: findUserExists.id,
            expiresIn: env.JWT_EXPIRES_IN_REFRESH_TOKEN
        })

        // criar data de expiração do refresh token
        const expireDateRefreshToken = this.dayjsDateProvider.addDays(10)

        // Salvar refresh token no banco
        await this.usersTokensRepository.create({
            idUser: findUserExists.id,
            expireDate: expireDateRefreshToken,
            token: refreshToken,
        })

        findUserExists = await this.usersRepository.getUserSecurity(findUserExists.id) as User

        return {
            user: findUserExists,
            accessToken,
            refreshToken,
        }
    }
}