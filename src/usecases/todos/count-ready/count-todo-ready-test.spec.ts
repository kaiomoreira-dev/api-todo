import { beforeEach, describe, expect, test } from "vitest";
import { CountTodoReadyUseCase } from "./count-todo-ready-usecase";
import { InMemoryTodoRepository } from "@/repositories/in-memory/in-memory-todos-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { CreateTodoUseCase } from "../create/create-todo-usecase";
import { MarktTodoCompletedUseCase } from "../mark-complete/mark-complete-useca";

let todosRepositoryInMemory: InMemoryTodoRepository
let usersRepositoryInMemory: InMemoryUsersRepository;
let markTodoCompletedUseCase: MarktTodoCompletedUseCase;
let createTodoUseCase: CreateTodoUseCase;
let stu: CountTodoReadyUseCase;

describe("Count all todo ready by user (unit)", () => {
    beforeEach(async () => {
        todosRepositoryInMemory = new InMemoryTodoRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        markTodoCompletedUseCase = new MarktTodoCompletedUseCase(todosRepositoryInMemory)
        createTodoUseCase = new CreateTodoUseCase(
            todosRepositoryInMemory
        )
        stu = new CountTodoReadyUseCase(todosRepositoryInMemory)

        await usersRepositoryInMemory.create({
            id: 'id-user-test',
            email: 'user-test@test.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to count all todo ready by user id", async () => {
        const { todo } = await createTodoUseCase.execute({ 
            description: 'fazer janta',
            idUser: 'id-user-test',
        });

        await markTodoCompletedUseCase.execute({ id: todo.id })

        const countTodoReady = await stu.execute({
            idUser: 'id-user-test'
        })

        expect(countTodoReady.count).toBe(1)

    });

});