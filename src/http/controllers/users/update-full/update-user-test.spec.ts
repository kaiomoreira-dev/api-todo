import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Update User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a user', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp, 
            'dee2a509-b42d-4c80-a733-d76bce3a2fe0',
            'user3@test.com' 
            )

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Kaio Moreira',
            email: 'user5-dev@outlook.com',
        })
            
        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to update a user with id user invalid', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp, 
            '960670a5-8adc-4135-b624-07f5c856906b',
            'user1@test.com'
            )
        
            

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: 'dee2a509-b42d-4c80-a733-d76bce3a2f10',
            name: 'Kaio Moreira',
            email: 'user11-dev@outlook.com',
        })
            
        expect(response.statusCode).toEqual(404)
    })

    test('should not be able to update a user with Email alredy exists', async()=>{
        await createAndAuthenticateUser(
            fastifyApp, 
            '6f4d1e86-c908-431a-aa11-08305024cd02',
            'user12@test.com'
            )
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp, 
            '35fbad92-bacf-45f8-bf41-85a9f1074181',
            'user11@test.com'
            )

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Kaio Moreira',
            email: 'user12@test.com',
        })
        expect(response.statusCode).toEqual(409)
    })
  
})