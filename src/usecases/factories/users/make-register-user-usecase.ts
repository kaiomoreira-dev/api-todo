import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { RegisterUseCase } from "@/usecases/users/register/register-usecase";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";

export async function makeRegisterUser(): Promise<RegisterUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const usersTokensRepository = new PrismaTokensRepository();
    const sendMailProvider = new MailProvider();
    const dayjsDateProvider = new DayjsDateProvider();
    const registerUserUseCase = new RegisterUseCase(
        usersRepository,
        dayjsDateProvider,
        usersTokensRepository,
        sendMailProvider,
    )

    return registerUserUseCase
}