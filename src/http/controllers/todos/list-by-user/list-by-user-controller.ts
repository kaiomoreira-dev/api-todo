import { makeCountAllTodos } from '@/usecases/factories/todos/make-count-all-todo-usecase'
import { makeListTodoByUser } from '@/usecases/factories/todos/make-list-todos-by-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListByUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const listTodoByUserUseCase = await makeListTodoByUser()
            
            const listTodos = await listTodoByUserUseCase.execute({
                idUser: request.user.id
            })
            return reply.status(200).send(listTodos)
          } catch (error) {
            throw error
          }
}
    
