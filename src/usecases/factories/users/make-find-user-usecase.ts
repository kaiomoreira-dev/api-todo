import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FindUserUseCase } from "../../users/find/find-user-usecase";

export async function makeFindUser(): Promise<FindUserUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const findUserUseCase = new FindUserUseCase(usersRepository)

    return findUserUseCase
}