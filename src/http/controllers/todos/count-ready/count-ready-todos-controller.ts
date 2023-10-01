import { makeCountReadyTodos } from '@/usecases/factories/todos/make-count-ready-todo-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function CountReady (request: FastifyRequest, reply:FastifyReply){
        try {
            const makeCountReadyTodosUseCase = await makeCountReadyTodos()
            
            const countTodos = await makeCountReadyTodosUseCase.execute({
                idUser: request.user.id
            })
            return reply.status(200).send(countTodos)
            
          } catch (error) {
            throw error
          }
}
    
