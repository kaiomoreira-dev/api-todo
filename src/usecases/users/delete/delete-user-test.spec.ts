import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { DeleteUserUseCase } from "./delete-user-usecase";
import { User } from "@prisma/client";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: DeleteUserUseCase;

describe("Delete user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new DeleteUserUseCase(
            usersRepositoryInMemory, 
        )

         await usersRepositoryInMemory.create({
            id:'id-user-1',
            email: 'user-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        }); 

    });

    test("Should be able to delete user", async () => {
        await stu.execute({
            id: 'id-user-1'
        });
        
        const findUserExist = await usersRepositoryInMemory.findById('id-user-1') as User

        expect(findUserExist).toEqual(null)
    });

    test("Should not be able to delete a user is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

})