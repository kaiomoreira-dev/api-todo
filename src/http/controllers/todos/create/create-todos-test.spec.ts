import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Create Todo (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a todo', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            '6f4d1e86-c908-431a-aa11-08305024cd02',
            'user2@test.com'
            )
        const response = await request(fastifyApp.server)
        .post(`/api/todos`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            description: "description teste"
        })

        expect(response.statusCode).toEqual(201)
    })
})