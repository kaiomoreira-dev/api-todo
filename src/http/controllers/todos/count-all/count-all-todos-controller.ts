import { makeCountAllTodos } from '@/usecases/factories/todos/make-count-all-todo-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function CountAll (request: FastifyRequest, reply:FastifyReply){
        try {

            const makeCountAllTodosUseCase = await makeCountAllTodos()
            
            const countTodos = await makeCountAllTodosUseCase.execute({
                idUser: request.user.id
            })
            return reply.status(200).send(countTodos)
            
          } catch (error) {
            throw error
          }
}
    
