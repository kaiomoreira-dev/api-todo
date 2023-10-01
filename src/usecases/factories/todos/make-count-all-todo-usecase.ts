import { CountAllTodoUseCase } from "@/usecases/todos/count-all/count-all-todo-usecase";
import { PrismaTodosRepository } from "@/repositories/prisma/prisma-todos-repository";

export async function makeCountAllTodos(): Promise<CountAllTodoUseCase> {
    const todosRepository = new PrismaTodosRepository();
    const countAllTodoUseCase = new CountAllTodoUseCase(todosRepository)

    return countAllTodoUseCase
}