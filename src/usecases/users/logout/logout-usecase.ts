import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { sign, verify } from "jsonwebtoken";
import { env } from "@/env";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { IStorageInMemoryProvider } from '@/providers/StorageInMemoryProvider/interface-storage-in-memory';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';

interface IRequestLogout {
    token: string
    refreshToken: string
    idUser: string
}

export class LogoutUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
        private storageInMemoryProvider: IStorageInMemoryProvider,
        private dayjsDateProvider: IDateProvider
    ) {}

    async execute({
        token,
        refreshToken,
        idUser
    }:IRequestLogout):Promise<void>{
        const userToken = await this.usersTokensRepository.findByUserAndToken(idUser, refreshToken)

        if(!userToken){
            throw new ResourceNotFoundError()
        }

        // deletar refresh token do banco de dados
        await this.usersTokensRepository.delete(userToken.id)
        //[x] adicionar token na blacklist
        await this.storageInMemoryProvider.addToBlackList(token)

        //[x] verificar se existe data de expiração no redi
        const dataExpirateClearBlackList = await this.storageInMemoryProvider.getDatesToDeleteBlackList()
        if(dataExpirateClearBlackList.length === 0){
            const newDateExpire = JSON.stringify(this.dayjsDateProvider.addDays(30))
           await this.storageInMemoryProvider.addNewDateToDeleteBlackList(newDateExpire)
        }
        const [newDateExpire] = await this.storageInMemoryProvider.getDatesToDeleteBlackList()
        const dataExpirate = new Date(JSON.parse(newDateExpire))
        const dateNow = this.dayjsDateProvider.dateNow()
        const verifyExpireDate = this.dayjsDateProvider.compareIfBefore(dateNow, dataExpirate)

       if(!verifyExpireDate){
           await this.storageInMemoryProvider.clearBlackList()
           await this.storageInMemoryProvider.resetDatesToDeleteBlackList()
       }
    }
}