import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Find User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to find a user', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(fastifyApp)
        
        const response = await request(fastifyApp.server)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
            
        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to find a user with invalid id', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp, 
            'bda51c4d-5071-4abb-b94b-d45c6813304d',
            'user1@test.com'
            )

        const fakeId = '528404fd-9b4d-43cd-a190-f9dd28f86540'

        const response = await request(fastifyApp.server)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })
})