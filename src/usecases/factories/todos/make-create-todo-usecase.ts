import { PrismaTodosRepository } from "@/repositories/prisma/prisma-todos-repository";
import { CreateTodoUseCase } from "@/usecases/todos/create/create-todo-usecase";

export async function makeCreateTodo(): Promise<CreateTodoUseCase> {
    const todosRepository = new PrismaTodosRepository();
    const createTodoUseCase = new CreateTodoUseCase(todosRepository)

    return createTodoUseCase
}