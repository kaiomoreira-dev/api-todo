import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { RefreshTokenUseCase } from "./refresh-token-usecase";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { LoginUseCase } from "../login/login-usecase";
import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";
import { Token } from "@prisma/client";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let loginUseCase: LoginUseCase;
let sendMailProvider: InMemoryMailProvider
let stu: RefreshTokenUseCase;

describe("Refresh token (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        dayjsDateProvider = new DayjsDateProvider()
        sendMailProvider = new InMemoryMailProvider()
        loginUseCase = new LoginUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory, 
            dayjsDateProvider
        )
        stu = new RefreshTokenUseCase(
            usersTokensRepositoryInMemory,
            dayjsDateProvider,
        )

        // criar usuário
        await usersRepositoryInMemory.create({
            id: 'id-user-1',
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
        vi.useFakeTimers()
    });

    afterEach(()=>{
        vi.useFakeTimers()
    })

    test("Should be able to create a new refresh token", async () => {
        const {refreshToken} = await loginUseCase.execute({
            email: 'user1-test@email.com',
            password: '123456'
        })

        const newTokens = await stu.execute({ 
            token: refreshToken
        });
        
        expect(newTokens).toEqual(
            expect.objectContaining({
                refreshToken: expect.any(String),
                accessToken: expect.any(String),
            })
        )
    });

    test("Should not be able to refresh token expired", async () => {
        vi.setSystemTime( new Date(2023, 8, 23, 19, 0, 0))
        const {user} = await loginUseCase.execute({
            email: 'user1-test@email.com',
            password: '123456'
        })
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id) as Token

        vi.setSystemTime( new Date(2023, 9, 23, 23, 0, 0))

        await expect(()=> stu.execute({ 
         token: userToken.token,
     }),
         ).rejects.toBeInstanceOf(AccessTimeOutError)
     });
});