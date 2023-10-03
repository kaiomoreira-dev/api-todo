import { env } from "@/env";
import "dotenv/config";
import { createClient } from "redis";

export const redisClient = env.NODE_ENV === "development" ?
    createClient() :
    createClient({url: env.REDIS_URL})

redisClient.connect()
.then(()=>{
    console.log('Connect redis success')
})
.catch((err)=>{
    console.log('Error to connect redis', err)
})





