import { beforeEach, describe, expect, test } from "vitest";
import { CreateTodoUseCase } from "./create-todo-usecase";
import { InMemoryTodoRepository } from "@/repositories/in-memory/in-memory-todos-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";

let todosRepositoryInMemory: InMemoryTodoRepository
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: CreateTodoUseCase;

describe("Create todo (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        todosRepositoryInMemory = new InMemoryTodoRepository()
        stu = new CreateTodoUseCase(
            todosRepositoryInMemory
        )

        await usersRepositoryInMemory.create({
            id: 'id-user-test',
            email: 'user-test@test.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to create a new todo", async () => {
        const { todo } = await stu.execute({ 
            description: 'fazer janta',
            idUser: 'id-user-test',
        });

       expect(todo).toEqual(
            expect.objectContaining({
                description: todo.description,
            })
       )
    });

});