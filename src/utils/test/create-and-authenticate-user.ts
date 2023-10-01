import { prisma } from "@/lib/prisma-client";
import { IResponseLoginAccount } from "@/usecases/users/login/login-usecase";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
    fastifyApp: FastifyInstance, 
    id?: string,
    email?:string, 
    ) {
    // criar usuario pelo prisma
    await prisma.user.create({
        data:{
            id: id ? id : randomUUID(),
            name:'user1',
            email: email ? email : 'user@test.com',
            password: await hash('123456', 8),
            emailActive: false,
        }
    })

    // autenticar usuario
    const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: email ? email : 'user@test.com',
            password: '123456',
        }) 
    
    const { accessToken, refreshToken, user} = response.body as IResponseLoginAccount
    
    // retornar acessToken, refreshToken e usuario
    return {
        user,
        accessToken,
        refreshToken
    }
}