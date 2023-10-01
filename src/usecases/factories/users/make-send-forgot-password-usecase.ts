import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { SendForgotPasswordUseCase } from "@/usecases/users/send-forgot-password/send-forgot-password-usecase";

export async function makeSendForgotPassword(): Promise<SendForgotPasswordUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const usersTokensRepository = new PrismaTokensRepository();
    const dayjsDateProvider = new DayjsDateProvider();
    const sendMailProvider = new MailProvider();
    const sendForgotPasswordUseCase = new SendForgotPasswordUseCase(
        usersRepository,
        usersTokensRepository,
        dayjsDateProvider,
        sendMailProvider
    )

    return sendForgotPasswordUseCase
}