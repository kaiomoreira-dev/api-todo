import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";
import { LogoutUseCase } from "@/usecases/users/logout/logout-usecase";

export async function makeLogoutUser(): Promise<LogoutUseCase> {
    const usersTokensRepository = new PrismaTokensRepository();
    const logoutUseCase = new LogoutUseCase(usersTokensRepository)

    return logoutUseCase
}