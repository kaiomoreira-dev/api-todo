import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Todo } from "@prisma/client";

describe('List by Todos by User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list todos by user', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            '6f4d1e86-c908-431a-aa11-08305024cd02',
            'user2@test.com'
            )

        for(let i = 1; i < 6; i++){
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

            const responseMarkTodoCompled = await request(fastifyApp.server)
            .patch(`/api/todos/mark-completed/${id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        }

        const responseListTodosByUser = await request(fastifyApp.server)
        .get(`/api/todos/user`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListTodosByUser.statusCode).toEqual(200)
        expect(responseListTodosByUser.body.todos).toHaveLength(5)
    })
})