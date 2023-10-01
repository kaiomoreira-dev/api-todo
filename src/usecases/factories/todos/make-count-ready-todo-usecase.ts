import { PrismaTodosRepository } from "@/repositories/prisma/prisma-todos-repository";
import { CountTodoReadyUseCase } from "@/usecases/todos/count-ready/count-todo-ready-usecase";

export async function makeCountReadyTodos(): Promise<CountTodoReadyUseCase> {
    const todosRepository = new PrismaTodosRepository();
    const countTodoReadyUseCase = new CountTodoReadyUseCase(todosRepository)

    return countTodoReadyUseCase
}