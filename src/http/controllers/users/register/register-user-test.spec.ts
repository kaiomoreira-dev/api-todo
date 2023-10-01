import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Register User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to register a user', async()=>{
        const response = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })
            
        expect(response.statusCode).toEqual(201)
    })

    test('should not be able to register a user with email already exists', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })

        const response = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })
            
        expect(response.statusCode).toEqual(409)
    })

    test('should not be able to register a user with cpf already exists', async()=>{
        await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user2-dev@outlook.com',
            password: '123456',
        })

        const response = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
        })
            
        expect(response.statusCode).toEqual(409)
    })

})