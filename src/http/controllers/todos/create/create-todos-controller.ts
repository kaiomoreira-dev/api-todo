import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeCountAllTodos } from '@/usecases/factories/todos/make-count-all-todo-usecase'
import { makeCreateTodo } from '@/usecases/factories/todos/make-create-todo-usecase'
import { makeDeleteUser } from '@/usecases/factories/users/make-delete-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function Create (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                description: z.string().nonempty()
            })

            const { 
                description
            } = userSchema.parse(request.body)

            const makeCreateTodoUseCase = await makeCreateTodo()
            
            const todo = await makeCreateTodoUseCase.execute({
                idUser: request.user.id,
                description
            })
            return reply.status(201).send(todo)
            
          } catch (error) {
            throw error
          }
}
    
