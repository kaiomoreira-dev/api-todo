import { redisClient } from "@/config/redis-connection";
import { IStorageInMemoryProvider } from "../interface-storage-in-memory";

export class RedisInMemoryProvider implements IStorageInMemoryProvider {
    async resetDatesToDeleteBlackList(): Promise<void> {
        await redisClient.del('DATE_DELETE_BLACKLIST')
    }
    async addNewDateToDeleteBlackList(date: string){
        await redisClient.sAdd('DATE_DELETE_BLACKLIST', date)
    }
    async getDatesToDeleteBlackList(){
        const date = await redisClient.sMembers('DATE_DELETE_BLACKLIST')

        return date
    }
    async listBlackList() {
        const tokens = await redisClient.sMembers('BLACKLIST')

        return tokens
    }

    async addToBlackList(token: string) {
        await redisClient.sAdd('BLACKLIST', token )
    }

    async isTokenInBlackList(token: string) {
        const inBlackList = await redisClient.sIsMember('BLACKLIST', token)

        if(!inBlackList){
            return false
        }

        return inBlackList
    }
    
    async clearBlackList() {
        await redisClient.del('BLACKLIST')

        const tokens = await redisClient.sMembers('BLACKLIST')

        return tokens
    }
}