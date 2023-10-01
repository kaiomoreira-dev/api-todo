import { AccessTimeOutError } from '@/usecases/errors/access-time-out-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeResetPassword } from '@/usecases/factories/users/make-reset-password-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ResetPassword (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              password: z.string().min(6).nonempty(),
            })
            const userSchemaQuery = z.object({
                token: z.string().nonempty(),
              })

            const {
              password,
            } = userSchemaBody.parse(request.body)

            const {
                token,
              } = userSchemaQuery.parse(request.query)

            const resetPasswordUseCase = await makeResetPassword()

            await resetPasswordUseCase.execute({
              password,
                token
            })

            return reply.status(200).send({ message: 'Password reset successfully' })

          } catch (error) {
            if(error instanceof ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            if(error instanceof AccessTimeOutError){
              return reply.status(401).send({ message: error.message})
            }
          }
}

