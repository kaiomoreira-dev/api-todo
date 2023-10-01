import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { FindUserUseCase } from "./find-user-usecase";
import { hash } from "bcrypt";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: FindUserUseCase;

describe("Find user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new FindUserUseCase(
            usersRepositoryInMemory, 
        )

         await usersRepositoryInMemory.create({
            id:'9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            email: 'user-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        }); 

    });

    test("Should be able to find user", async () => {
        const findUser = await stu.execute({
            id: '9d292a63-ec48-44d1-8b31-c7c9f9c97013'
        });
        expect(findUser.user).toEqual(
            expect.objectContaining({
                id: '9d292a63-ec48-44d1-8b31-c7c9f9c97013'
            })
        )
    });

    test("Should not be able to find user is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

})