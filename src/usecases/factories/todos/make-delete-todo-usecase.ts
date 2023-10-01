import { PrismaTodosRepository } from "@/repositories/prisma/prisma-todos-repository";
import { DeleteTodoUseCase } from "@/usecases/todos/delete/delete-todo-usecase";

export async function makeDeleteTodo(): Promise<DeleteTodoUseCase> {
    const todosRepository = new PrismaTodosRepository();
    const deleteTodoUseCase = new DeleteTodoUseCase(todosRepository)

    return deleteTodoUseCase
}