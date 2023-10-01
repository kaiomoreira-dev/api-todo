import { PrismaTodosRepository } from "@/repositories/prisma/prisma-todos-repository";
import { MarktTodoCompletedUseCase } from "@/usecases/todos/mark-complete/mark-complete-useca";

export async function makeMarkCompleteTodo(): Promise<MarktTodoCompletedUseCase> {
    const todosRepository = new PrismaTodosRepository();
    const marktTodoCompletedUseCase = new MarktTodoCompletedUseCase(todosRepository)

    return marktTodoCompletedUseCase
}