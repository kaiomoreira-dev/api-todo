import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Login User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to login a user', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should be able to login a user with email wrong', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user2-dev@outlook.com',
            password: '123456',
        })

        expect(response.statusCode).toEqual(401)
    })

    test('should be able to login a user with password wrong', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user1-dev@outlook.com',
            password: '123456789',
        })

        expect(response.statusCode).toEqual(401)
    })

    test('should be able to login a user with password wrong', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user1-dev@outlook.com',
            password: '12345678999',
        })

        expect(response.statusCode).toEqual(401)
    })

})