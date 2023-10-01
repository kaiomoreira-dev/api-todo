import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Logout User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to logout a user', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const responseLogin = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        expect(responseLogin.statusCode).toEqual(200)

        const responseLogout = await request(fastifyApp.server)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${responseLogin.body.accessToken}`)
        .send({
            refreshToken: responseLogin.body.refreshToken,
        })

        expect(responseLogout.statusCode).toEqual(200)
    })

    test('should not be able to logout a user invalid', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const responseLogin = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        expect(responseLogin.statusCode).toEqual(200)

        const responseLogout = await request(fastifyApp.server)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${responseLogin.body.accessToken}`)
        .send({
            refreshToken: 'fake-refresh-token',
        })
        expect(responseLogout.statusCode).toEqual(401)
    })

})