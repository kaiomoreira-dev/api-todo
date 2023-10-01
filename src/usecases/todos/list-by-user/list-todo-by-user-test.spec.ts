import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryTodoRepository } from "@/repositories/in-memory/in-memory-todos-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { ListTodoByUserUseCase } from "./list-todo-by-user-usecase";

let todosRepositoryInMemory: InMemoryTodoRepository
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: ListTodoByUserUseCase;

describe("List all todo by user (unit)", () => {
    beforeEach(async () => {
        todosRepositoryInMemory = new InMemoryTodoRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new ListTodoByUserUseCase(todosRepositoryInMemory)

        await usersRepositoryInMemory.create({
            id: 'id-user-test',
            email: 'user-test@test.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able todos by user id", async () => {
        for(let i = 1; i <= 2; i++){
            await todosRepositoryInMemory.create({
                id: `id-todo-${i}`,
                description: `fazer o almoço`,
                idUser: 'id-user-test',
            })
        }

        const todos = await stu.execute({
            idUser: 'id-user-test'
        })

        expect(todos.todos).toHaveLength(2)

        expect(todos.todos).toEqual(
            [
                expect.objectContaining({id:'id-todo-1'}),
                expect.objectContaining({id:'id-todo-2'}),
            ]
        )


    });

});