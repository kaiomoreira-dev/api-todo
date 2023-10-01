import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeCountAllTodos } from '@/usecases/factories/todos/make-count-all-todo-usecase'
import { makeMarkCompleteTodo } from '@/usecases/factories/todos/make-mark-completed-todo-usecase'
import { makeDeleteUser } from '@/usecases/factories/users/make-delete-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function MarkCompleted (request: FastifyRequest, reply:FastifyReply){
        try {
          const todoSchemaParams = z.object({
            id: z.string().uuid().nonempty()
          })

          const { id } = todoSchemaParams.parse(request.params)

            const markTodoCompleteUseCase = await makeMarkCompleteTodo()
            
            await markTodoCompleteUseCase.execute({
                id
            })
            return reply.status(200).send({message: "Todo marked as completed"})
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
              return reply.status(404).send({message: error.message})
            }
            throw error
          }
}
    
