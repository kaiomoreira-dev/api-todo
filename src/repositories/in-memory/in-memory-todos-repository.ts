import { Prisma, Todo } from "@prisma/client";
import { ITodosRepository } from "../interface-todos-repository";
import { randomUUID } from "crypto";

export class InMemoryTodoRepository implements ITodosRepository{
    private todos: Todo[] = []

    async create({
        id,
        completed,
        description,
        idUser,
    }: Prisma.TodoUncheckedCreateInput){
        const todo = {
            id: id ? id : randomUUID(),
            completed: completed ? completed : false,
            description,
            idUser,
            createdAt: new Date(),
        }

        this.todos.push(todo)

        return todo
    }

    async findById(id: string){
        const todo = this.todos.find(todo => todo.id === id)

        if(!todo){
            return null
        }

        return todo;
    }

    async list(idUser: string){
        const filterTodosByUser = this.todos.filter(todo => todo.idUser === idUser)

        return filterTodosByUser
    }

    async countAllByUserId(idUser: string){
        const todos = this.todos.filter(todo => todo.idUser === idUser)

        return todos.length
    }

    async countAllReadyByUserId(idUser: string){
        const todos = this.todos.filter(todo => 
            todo.idUser === idUser && 
            todo.completed === true)
        
        return todos.length
    }

    async markCompletedTrue(id: string){
        const todoIndex = this.todos.findIndex(todo => todo.id === id)

        this.todos[todoIndex].completed = true

        return this.todos[todoIndex]
    }
    
    async delete(id: string){
       const todoIndex = this.todos.findIndex(todo => todo.id === id)

       this.todos.splice(todoIndex, 1)
    }

}