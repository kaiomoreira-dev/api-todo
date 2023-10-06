import { ICacheProvider } from "../interface-cache"

export interface Cache{
    blacklist?: string[]
    date?: string[]
}

export class InMemoryCacheProvider implements ICacheProvider{
    private cache: Cache[] = []

    async addToBlackList(token: string){
        this.cache.push({blacklist: [token]})
    }
    async addNewDateToDeleteBlackList(date: string){
        this.cache.push({date: [date]})
    }

    async resetDatesToDeleteBlackList(){
        this.cache.splice(0, 1)
    }

    async getDatesToDeleteBlackList(): Promise<string[]> {
        const getDate = []
        for(let index of this.cache){
            if(index.date){
                const [date] = index.date
                getDate.push(date)
            }
        }
        return getDate
    }

    async isTokenInBlackList(token: string): Promise<boolean> {
        const tokenInBlackList = this.cache.find(item => {
            if(!item.blacklist){
                return false
            }
            return item.blacklist.includes(token)
        })

        if(tokenInBlackList){
            return true
        }

        return false
    }

    async listBlackList(): Promise<string[]> {
        const blackList = this.cache.map(item => {
            return item.blacklist
        })

        return blackList as unknown as string[]
    }
    
    async clearBlackList(): Promise<void> {
        // limpar array de token dentro do cache
        this.cache.splice(0, 1)
    }

  
}