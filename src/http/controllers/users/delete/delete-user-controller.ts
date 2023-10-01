import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeDeleteUser } from '@/usecases/factories/users/make-delete-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id
            } = userSchema.parse(request.params)

            const deleteUserUseCase = await makeDeleteUser()
            
            await deleteUserUseCase.execute({
                id
            })
            
            
            return reply.status(200).send({message: 'User deleted successfully'})
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
