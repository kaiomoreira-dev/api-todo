import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { LoginUseCase } from "../login/login-usecase";
import { LogoutUseCase } from "./logout-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ICacheProvider } from "@/providers/CacheProvider/interface-cache";
import { InMemoryCacheProvider } from "@/providers/CacheProvider/in-memory/in-memory-cache-provider";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let loginUseCase: LoginUseCase;
let sendMailProvider: InMemoryMailProvider
let cacheProviderInMemory: InMemoryCacheProvider
let stu: LogoutUseCase;

describe("Logout (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        dayjsDateProvider = new DayjsDateProvider()
        sendMailProvider = new InMemoryMailProvider()
        cacheProviderInMemory = new InMemoryCacheProvider()
        loginUseCase = new LoginUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory, 
            dayjsDateProvider
        )
        stu = new LogoutUseCase(
            usersTokensRepositoryInMemory,
            cacheProviderInMemory,
            dayjsDateProvider
        )

        // criar usuário
        await usersRepositoryInMemory.create({
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            password: await hash('123456', 8),
        }); 

        vi.useFakeTimers()
    });

    afterEach(()=>{
        vi.useRealTimers()
    })

    test("Should be able to logout", async () => {
        const {accessToken, refreshToken, user} = await loginUseCase.execute({
            email: 'email1@test.com',
            password: '123456'
        })

        await stu.execute({ 
            refreshToken,
            idUser: user.id,
            token: accessToken
        });
        
        const userToken = await usersTokensRepositoryInMemory.findByToken(refreshToken)
        const userTokenCache = await cacheProviderInMemory.getDatesToDeleteBlackList()

        expect(userToken).toEqual(null)
        expect(userTokenCache).toHaveLength(1)
    });

    test("Should be able to verify date for clear balcklist when logout", async () => {
        const {accessToken, refreshToken, user} = await loginUseCase.execute({
            email: 'email1@test.com',
            password: '123456'
        })
        vi.setSystemTime( new Date(2023, 10, 5, 19, 0, 0))
        await stu.execute({ 
            refreshToken,
            idUser: user.id,
            token: accessToken
        });

        vi.setSystemTime( new Date(2023, 10, 12, 19, 0, 0))
        const {accessToken: newAccessToken, refreshToken: newRefreshToken, user: newUuser} = await loginUseCase.execute({
            email: 'email1@test.com',
            password: '123456'
        })
        await stu.execute({ 
            refreshToken: newRefreshToken,
            idUser: newUuser.id,
            token: newAccessToken
        });
        
        const userToken = await usersTokensRepositoryInMemory.findByToken(refreshToken)
        const userTokenCache = await cacheProviderInMemory.getDatesToDeleteBlackList()

        expect(userToken).toEqual(null)
        expect(userTokenCache).toHaveLength(0)
    });

    test("Should not be able to verify a account with token not found", async () => {
        const {accessToken, refreshToken, user} = await loginUseCase.execute({
            email: 'email1@test.com',
            password: '123456'
        })

        await expect(()=> stu.execute({ 
         refreshToken: 'fake-refresh-token',
         idUser: user.id,
         token: accessToken
     }),
         ).rejects.toBeInstanceOf(ResourceNotFoundError)
     });

});