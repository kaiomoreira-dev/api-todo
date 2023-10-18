import { IUsersRepository } from "@/repositories/interface-users-repository";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { randomUUID } from "crypto";
import { env } from "@/env";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestForgotPasswordEmail {
    email: string
}

export class SendForgotPasswordUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
        private sendMailProvider: IMailProvider

    ) {}

    async execute({
        email
    }:IRequestForgotPasswordEmail):Promise<void>{
        // buscar usuario no banco pelo email
        const findUserByEmail = await this.usersRepository.findByEmail(email)

        // validar se usuario existe no banco
        if(!findUserByEmail){
            throw new ResourceNotFoundError()
        }
        // pegar caminho do arquivo handlebars forgot-password.hbs
        let pathTemplate = env.NODE_ENV === "development" ? 
        './views/emails/forgot-password.hbs':
        './build/views/emails/forgot-password.hbs' 

        // criar token com uuid
        const token = randomUUID()
        console.log(token)
         // criar data de expiração
        const expireDate = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
        await this.usersTokensRepository.create({
            idUser: findUserByEmail.id,
            expireDate,
            token
        })

        // criar o link para redeinir senha
        const link = `${env.APP_URL}/reset-password?token=${token}`
        // enviar email com link de recuperação de senha
        await this.sendMailProvider.sendEmail(
            findUserByEmail.email, 
            findUserByEmail.name, 
            'Redefinição de Senha', 
            link, 
            pathTemplate 
        )
    }
}