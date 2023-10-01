import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeFindUser } from '@/usecases/factories/users/make-find-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id
            } = userSchema.parse(request.params)

            const findUserUseCase = await makeFindUser()
            
            const {user} = await findUserUseCase.execute({
                id
            })
            
            
            return reply.status(200).send(user)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
