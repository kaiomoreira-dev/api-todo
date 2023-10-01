import { AccessTimeOutError } from '@/usecases/errors/access-time-out-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeVerifyEmail } from '@/usecases/factories/users/make-verify-email-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function VerifyEmail (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              email: z.string().email(),
              token: z.string(),
            })

            const {
              email,
              token,
            } = userSchema.parse(request.query)

            const verifyEmailUseCase = await makeVerifyEmail()

            await verifyEmailUseCase.execute({
              token,
              email
            })

            return reply.status(200).send({ message: 'Verified email!' })

          } catch (error) {
            if(error instanceof ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            if(error instanceof AccessTimeOutError){
              return reply.status(401).send({ message: error.message})
            }
          }
}

