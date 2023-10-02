import { Prisma } from "@prisma/client";
import { ITokensRepository } from "../interface-tokens-repository";
import { prisma } from "@/lib/prisma";

export class PrismaTokensRepository implements ITokensRepository{
    async create(data: Prisma.TokenUncheckedCreateInput){
       const token = await prisma.token.create({data})
       return token
    }

    async findByToken(token: string){
        const tokenData = await prisma.token.findUnique({where: {token}})
        return tokenData
    }

    async findByUserId(idUser: string){
        const token = await prisma.token.findFirst({where: {idUser}})

        return token
    }

    async findByUserAndToken(idUser: string, token: string){
        const tokenData = await prisma.token.findFirst({where: {idUser, token}})
        return tokenData
    }
    
    async delete(id: string): Promise<void> {
        await prisma.token.delete({where: {id}})
    }
}