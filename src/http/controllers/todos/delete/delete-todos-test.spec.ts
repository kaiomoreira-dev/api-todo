import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Todo } from "@prisma/client";

describe('Delete Todo (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a todo', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            '6f4d1e86-c908-431a-aa11-08305024cd02',
            'user2@test.com'
            )
        const responseCreateTodo = await request(fastifyApp.server)
        .post(`/api/todos`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            user:{
                id: user.id
            },
            description: "description teste"
        })

        const { id } = responseCreateTodo.body.todo as Todo

        const responseDeleteTodo = await request(fastifyApp.server)
        .delete(`/api/todos/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseDeleteTodo.statusCode).toEqual(200)
    })
})