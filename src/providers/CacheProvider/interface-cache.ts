export interface ICacheProvider {
    addToBlackList(token: string): Promise<void>
    addNewDateToDeleteBlackList(date: string): Promise<void>
    resetDatesToDeleteBlackList(): Promise<void>
    getDatesToDeleteBlackList(): Promise<string[] | []>
    isTokenInBlackList(token: string): Promise<boolean>
    listBlackList(): Promise<string[]>
    clearBlackList(): Promise<void>
}