import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateUserUseCase } from "@/usecases/users/update-full/update-user-usecase";

export async function makeUpdateUser(): Promise<UpdateUserUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const updateUserUseCase = new UpdateUserUseCase(usersRepository)

    return updateUserUseCase
}