import { env } from "@/env";
import { RedisInMemoryProvider } from "@/providers/CacheProvider/implementations/provider-redis-in-memory";
import { InvalidAccessTokenError } from "@/usecases/errors/invalid-access-token-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export interface IPayload {
    sub: string;
    email?: string;
}

export async function verifyTokenJWT(
    request: FastifyRequest,
    response: FastifyReply,
) {
    // destruturar do headers o toke
    const authHeader = request.headers.authorization;

    // validar no if pra ve se existe
    if (!authHeader) {
        throw new Error("Miss token");
    }
    // destruturar o token de dentro do authHeader
    const [, token] = authHeader.split(" ");
    // verificar no verify o token
    // retirar de dentro do verify o id do user que esta no token
    try {
        const { sub: idUser } = verify(token, env.JWT_SECRET_ACCESS_TOKEN) as IPayload;
        //[] verificar se o token existe na blacklist
        const storageInMemoryProvider = new RedisInMemoryProvider()

        const inBlackList = await storageInMemoryProvider.isTokenInBlackList(token)

        if(inBlackList){
            throw new InvalidAccessTokenError()
        }
        // depois pesquisar em um método findbyid que vamos criar
        // adicionar idUser no request
        request.user = {
            id: idUser,
            token,
        };
    } catch {
        throw new InvalidAccessTokenError();
    }
}
