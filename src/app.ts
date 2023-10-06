import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import { usersRoutes } from "./http/controllers/users/routes";
import { todosRoutes } from "./http/controllers/todos/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { InvalidAccessTokenError } from "./usecases/errors/invalid-access-token-error";

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })

fastifyApp.register(usersRoutes,{
    prefix: 'api/users'
})

fastifyApp.register(todosRoutes,{
  prefix: 'api/todos'
})
  
fastifyApp.setErrorHandler((error:FastifyError, _request:FastifyRequest, reply: FastifyReply)=>{
  if(error instanceof ZodError){
      return reply.status(400).send({message: 'Validation error', issues: error.format()})
  }
  if(error instanceof InvalidAccessTokenError){
    return reply.status(401).send({ message: error.message})
  }
  if(env.NODE_ENV !== 'production'){
      console.log(error)
  }else{
      // Aqui adicionar monitoramento de log em produção
      // como Sentry/NewRelic/DataDog
  }

  return reply.status(500).send({message: error.message})
})
