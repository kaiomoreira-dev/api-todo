import { PrismaTodosRepository } from "@/repositories/prisma/prisma-todos-repository";
import { ListTodoByUserUseCase } from "@/usecases/todos/list-by-user/list-todo-by-user-usecase";

export async function makeListTodoByUser(): Promise<ListTodoByUserUseCase> {
    const todosRepository = new PrismaTodosRepository();
    const listTodoByUserUseCase = new ListTodoByUserUseCase(todosRepository)

    return listTodoByUserUseCase
}