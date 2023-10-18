import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { EmailVerifyUserUseCase } from "@/usecases/users/email-exists/email-exists-users.usecase";

export async function makeVerifyEmailUser(): Promise<EmailVerifyUserUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const emailVerifyUserUseCase = new EmailVerifyUserUseCase(usersRepository)

    return emailVerifyUserUseCase
}