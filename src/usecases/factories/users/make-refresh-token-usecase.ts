import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { RefreshTokenUseCase } from "@/usecases/users/refresh-token/refresh-token-usecase";

export async function makeRefreshToken(): Promise<RefreshTokenUseCase> {
    const usersTokensRepository = new PrismaTokensRepository();
    const dayjsDateProvider = new DayjsDateProvider();
    const refreshTokenUseCase = new RefreshTokenUseCase(
        usersTokensRepository,
        dayjsDateProvider
        )

    return refreshTokenUseCase
}