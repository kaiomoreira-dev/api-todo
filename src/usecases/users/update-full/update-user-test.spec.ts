import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { UpdateUserUseCase } from "./update-user-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: UpdateUserUseCase;

describe("Update user (unit)", () => {
    beforeEach(async() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new UpdateUserUseCase(
            usersRepositoryInMemory, 
        )

        await usersRepositoryInMemory.create({
            id: 'id-user-1',
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
        
        await usersRepositoryInMemory.create({
            id: 'id-user-2',
            email: 'user2-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to update a user account", async () => {
        const { user } = await stu.execute({ 
            id: 'id-user-1',
            email: 'user2@test.com',
            name: 'Kaio Moreira',
        });

        expect(user).toEqual(
            expect.objectContaining({
                id: 'id-user-1',
                email: 'user2@test.com',
                name: 'Kaio Moreira',
            }),
        )
    });

    test("Should not be able to update a user account with id invalid", async () => {
        await expect(()=> stu.execute({ 
            id: 'id-user-3',
            email: 'user2@test.com',
            name: 'Kaio Moreira',
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

  

    test("Should not be able to update a user account with Email already exists", async () => {
        await expect(() => stu.execute({ 
            id: 'id-user-2',
            email: 'user1-test@email.com',
            name: 'Kaio Moreira',
        }),
            ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
    });

   
});