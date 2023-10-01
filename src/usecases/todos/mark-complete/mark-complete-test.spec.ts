import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryTodoRepository } from "@/repositories/in-memory/in-memory-todos-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { CreateTodoUseCase } from "../create/create-todo-usecase";
import { MarktTodoCompletedUseCase } from "./mark-complete-useca";
import { Todo } from "@prisma/client";

let todosRepositoryInMemory: InMemoryTodoRepository
let usersRepositoryInMemory: InMemoryUsersRepository;
let createTodoUseCase: CreateTodoUseCase;
let stu: MarktTodoCompletedUseCase;

describe("Mark todo complete (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        todosRepositoryInMemory = new InMemoryTodoRepository()
        createTodoUseCase = new CreateTodoUseCase(
            todosRepositoryInMemory
        )
        stu = new MarktTodoCompletedUseCase(todosRepositoryInMemory)

        await usersRepositoryInMemory.create({
            id: 'id-user-test',
            email: 'user-test@test.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to count all todo by user id", async () => {
        const { todo } = await createTodoUseCase.execute({ 
            description: 'fazer janta',
            idUser: 'id-user-test',
        });

       await stu.execute({
            id: todo.id
       })

       const findTodoCompleted = await todosRepositoryInMemory.findById(todo.id) as Todo

       expect(findTodoCompleted).toEqual(
        expect.objectContaining({
            completed: true,
        })
       )
    });

});