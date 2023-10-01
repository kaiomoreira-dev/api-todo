import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeLogoutUser } from '@/usecases/factories/users/make-logout-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function LogoutUser (request: FastifyRequest, reply:FastifyReply){
    try {
        const userSchema = z.object({
          refreshToken: z.string().nonempty(),
        })

        const {
            refreshToken
        } = userSchema.parse(request.body)
        
        const logoutUserUseCase = await makeLogoutUser()

        await logoutUserUseCase.execute({
            refreshToken,
            idUser: request.user.id
        })
        return reply.status(200).send({message: 'Logout performed successfully!'})

      } catch (error) {
        if(error instanceof ResourceNotFoundError){
          return reply.status(401).send({ message: error.message})
        }
      }
}

