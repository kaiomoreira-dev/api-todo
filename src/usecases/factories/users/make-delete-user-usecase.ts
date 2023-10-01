import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteUserUseCase } from "@/usecases/users/delete/delete-user-usecase";

export async function makeDeleteUser(): Promise<DeleteUserUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

    return deleteUserUseCase
}