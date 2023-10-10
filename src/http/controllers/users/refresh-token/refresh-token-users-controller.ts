import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { makeRefreshToken } from "@/usecases/factories/users/make-refresh-token-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function RefreshToken (request: FastifyRequest, reply:FastifyReply){
    try {
        const refreshTokenBodySchema = z.object({
            refreshToken: z.string().nonempty(),
        })

        const {
            refreshToken
        } = refreshTokenBodySchema.parse(request.body)

        const refreshTokenUseCase = await makeRefreshToken()

        const updatedTokens = await refreshTokenUseCase.execute({token: refreshToken})

        return reply.status(200).send(updatedTokens)
    } catch (error) {
        if(error instanceof ResourceNotFoundError){
            return reply.status(404).send({ message: error.message})
        }
        if(error instanceof AccessTimeOutError){
            return reply.status(401).send({ message: error.message})
          }
    }
}