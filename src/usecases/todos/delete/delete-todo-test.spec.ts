import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryTodoRepository } from "@/repositories/in-memory/in-memory-todos-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { CreateTodoUseCase } from "../create/create-todo-usecase";
import { DeleteTodoUseCase } from "./delete-todo-usecase";
import { Todo } from "@prisma/client";

let todosRepositoryInMemory: InMemoryTodoRepository
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: DeleteTodoUseCase;

describe("Count all todo by user (unit)", () => {
    beforeEach(async () => {
        todosRepositoryInMemory = new InMemoryTodoRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new DeleteTodoUseCase(todosRepositoryInMemory)

        await usersRepositoryInMemory.create({
            id: 'id-user-test',
            email: 'user-test@test.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to count all todo by user id", async () => {
        await todosRepositoryInMemory.create({ 
            id: 'id-todo-test-1',
            description: 'fazer janta',
            idUser: 'id-user-test',
        });

        await stu.execute({
            id: 'id-todo-test-1',
        })

        const tryFindTodoDeleted = await todosRepositoryInMemory.findById('id-todo-test-1') as Todo

        expect(tryFindTodoDeleted).toEqual(null)

    });

});