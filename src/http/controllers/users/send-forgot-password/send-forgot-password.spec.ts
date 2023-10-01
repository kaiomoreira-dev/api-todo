import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Send email forgot password (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to send email with link for reset password', async()=>{
        const {user} = await createAndAuthenticateUser(fastifyApp)

        const response = await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email: user.email
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to reset password with email wrong', async()=>{
        const response = await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email: 'fake@email.com'
        })

        expect(response.statusCode).toEqual(404)
    })

})