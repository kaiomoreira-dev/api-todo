import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";
import { ResetPasswordUseCase } from "@/usecases/users/reset-password/reset-password-usecase";

export async function makeResetPassword(): Promise<ResetPasswordUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const usersTokensRepository = new PrismaTokensRepository();
    const dayjsDateProvider = new DayjsDateProvider();
    const resetPasswordUseCase = new ResetPasswordUseCase(
        usersRepository,
        usersTokensRepository,
        dayjsDateProvider,
    )

    return resetPasswordUseCase
}