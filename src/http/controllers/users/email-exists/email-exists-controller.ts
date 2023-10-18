import { makeVerifyEmailUser } from '@/usecases/factories/users/make-email-exists-users-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function EmailExists (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                email: z.string().email().nonempty(),
            })

            const { 
                email
            } = userSchema.parse(request.query)

            const findUserUseCase = await makeVerifyEmailUser()
            
            const emailExists = await findUserUseCase.execute({
                email
            })
            
            return reply.status(200).send(emailExists)
            
          } catch (error) {
            throw error
          }
}
    
