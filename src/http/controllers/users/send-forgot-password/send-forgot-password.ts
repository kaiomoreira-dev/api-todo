import { AccessTimeOutError } from '@/usecases/errors/access-time-out-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeSendForgotPassword } from '@/usecases/factories/users/make-send-forgot-password-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function SendForgotPassword (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              email: z.string().email(),
            })

            const {
              email,
            } = userSchema.parse(request.body)

            const sendForgotPasswordUsecase = await makeSendForgotPassword()

            await sendForgotPasswordUsecase.execute({
              email
            })

            return reply.status(200).send({ message: 'Email with password reset link sent!' })

          } catch (error) {
            if(error instanceof ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
          }
}

