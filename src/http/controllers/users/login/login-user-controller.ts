import { CredentialsInvalidError } from '@/usecases/errors/credentials-invalid-error'
import { makeLoginUser } from '@/usecases/factories/users/make-login-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function LoginUser (request: FastifyRequest, reply:FastifyReply){
    try {
        const userSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })

        const {
            email,
            password,
        } = userSchema.parse(request.body)
        
        const loginUserUseCase = await makeLoginUser()

        const userInfo = await loginUserUseCase.execute({
          email,
          password,
        })
        return reply.status(200).send(userInfo)

      } catch (error) {
        if(error instanceof CredentialsInvalidError){
          return reply.status(401).send({ message: error.message})
        }
      }
}

