import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryTodoRepository } from "@/repositories/in-memory/in-memory-todos-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { CreateTodoUseCase } from "../create/create-todo-usecase";
import { CountAllTodoUseCase } from "./count-all-todo-usecase";

let todosRepositoryInMemory: InMemoryTodoRepository
let usersRepositoryInMemory: InMemoryUsersRepository;
let createTodoUseCase: CreateTodoUseCase;
let stu: CountAllTodoUseCase;

describe("Count all todo by user (unit)", () => {
    beforeEach(async () => {
        todosRepositoryInMemory = new InMemoryTodoRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        createTodoUseCase = new CreateTodoUseCase(
            todosRepositoryInMemory
        )
        stu = new CountAllTodoUseCase(todosRepositoryInMemory)

        await usersRepositoryInMemory.create({
            id: 'id-user-test',
            email: 'user-test@test.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to count all todo by user id", async () => {
        await createTodoUseCase.execute({ 
            description: 'fazer janta',
            idUser: 'id-user-test',
        });
        await createTodoUseCase.execute({ 
            description: 'fazer almoço',
            idUser: 'id-user-test',
        });
        await createTodoUseCase.execute({ 
            description: 'fazer café da tarde',
            idUser: 'id-user-test',
        });
        await createTodoUseCase.execute({ 
            description: 'fazer café da manhã',
            idUser: 'id-user-test',
        });

        const countAllTodo = await stu.execute({
            idUser: 'id-user-test'
        })

        expect(countAllTodo.count).toBe(4)

    });

});