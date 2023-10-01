import { env } from "./env";
import { fastifyApp } from "./app";

fastifyApp.listen({
    host: env.HOST,
    port: env.PORT,
}, ()=>{
    console.log(`Server Running on host: ${env.HOST} port: ${env.PORT}`)
})