import { FastifyInstance } from "fastify";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { Create } from "./create/create-todos-controller";
import { CountAll } from "./count-all/count-all-todos-controller";
import { MarkCompleted } from "./mark-completed/mark-completed-controller";
import { CountReady } from "./count-ready/count-ready-todos-controller";
import { ListByUser } from "./list-by-user/list-by-user-controller";
import { Delete } from "./delete/delete-todos-controller";

export async function todosRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    //[x] create todo
    fastifyApp.post('/', Create)

    //[x] count all todos
    fastifyApp.get('/count-all', CountAll)

    //[x] mark todo completed
    fastifyApp.patch('/mark-completed/:id', MarkCompleted)

    //[x] count ready todos
    fastifyApp.get('/count-ready', CountReady)

    //[x] list todos by user
    fastifyApp.get('/user', ListByUser)

    //[x] delete todo
    fastifyApp.delete('/:id', Delete)
}
