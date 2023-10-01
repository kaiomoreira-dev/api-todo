import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma-client";
import { randomUUID } from "crypto";

describe('Verify e-mail User (e2e)', ()=>{
    beforeAll(async()=>{
        vi.useFakeTimers()
        await fastifyApp.ready()

    })

    afterAll(async()=>{
        vi.useRealTimers()
        await fastifyApp.close()
    })

    test('should be able to verify e-mail a user', async()=>{
        const {user} = await createAndAuthenticateUser(fastifyApp)

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: user.id
            }
        })
        expect(response.statusCode).toEqual(200)
        expect(findUser).toEqual(
            expect.objectContaining({
                emailActive: true
            })
        )
        
    })

    test('should not be able to verify e-mail user with wrong email', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            randomUUID(),
            "user2@test.com"
            
            )
        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${accessToken}`)
        .send()

        expect(response.statusCode).toEqual(404)
    })

    test('should not be able to verify e-mail user with token expired', async()=>{
        vi.setSystemTime( new Date(2023, 10, 24, 7, 0, 0))
        const responseCreateUser = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })

        const {id, email} = responseCreateUser.body as User

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: id
            }
        }) as unknown as Token

        vi.setSystemTime( new Date(2023, 10, 24, 10, 0, 1))
        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: id
            }
        })
        expect(response.statusCode).toEqual(401)
        expect(findUser).toEqual(
            expect.objectContaining({
                emailActive: false
            })
        )
    })

})