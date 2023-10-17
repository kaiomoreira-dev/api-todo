import { User } from "@prisma/client";
import { hash } from 'bcrypt'
import 'dotenv/config'
import { randomUUID } from "crypto";
import { IUsersRepository } from "../../../repositories/interface-users-repository";
import { IDateProvider } from "../../../providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "../../../repositories/interface-tokens-repository";
import { IMailProvider } from "../../../providers/MailProvider/interface-mail-provider";
import { EmailAlreadyExistsError } from "../../errors/email-already-exists-error";
import { env } from "@/env";

interface IRequestRegisterAccount {
    email: string,
    name: string,
    password: string,
}
interface IResponseRegisterAccount {
    user: User
}

export class RegisterUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private dayjsDateProvider: IDateProvider,
        private usersTokensRepository: ITokensRepository,
        private sendMailProvider: IMailProvider
    ) {}

    async execute({
        email,
        name,
        password,
    }:IRequestRegisterAccount):Promise<IResponseRegisterAccount>{
        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists){
            throw new EmailAlreadyExistsError()
        }

        const criptingPassword = await hash(password, 8)

        const user = await this.usersRepository.create({
            email,
            name,
            password: criptingPassword,
        })

        // pegar template de verificaçao de email
        let pathTemplate = env.NODE_ENV === "development" ? 
        './views/emails/verify-email.hbs':
        './build/views/emails/verify-email.hbs' 
        
        // gerar token valido por 3h
        const token = randomUUID()
        console.log(token)

        // salvar token no banco
       await this.usersTokensRepository.create({
            idUser: user.id,
            token
        })
        // formatar link com token
        const link = `${env.APP_URL}/verify-email?email=${email}&token=${token}`

        // enviar verificação de email
        await this.sendMailProvider.sendEmail(
            email, 
            name,
            "Confirmação de email", 
            link, 
            pathTemplate
        )
        return {
            user
        }
    }
}