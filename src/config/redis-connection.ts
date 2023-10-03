import "dotenv/config";
import { createClient } from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.connect()
.then(()=>{
    console.log('Connect redis success')
})
.catch((err)=>{
    console.log('Error to connect redis', err)
})





