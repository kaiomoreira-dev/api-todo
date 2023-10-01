import { env } from "@/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
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

        // depois pesquisar em um método findbyid que vamos criar
        // adicionar idUser no request
        request.user = {
            id: idUser,
        };
    } catch {
        throw new Error("Invalid token");
    }
}
