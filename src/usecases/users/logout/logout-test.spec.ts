import { beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { LoginUseCase } from "../login/login-usecase";
import { LogoutUseCase } from "./logout-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let loginUseCase: LoginUseCase;
let sendMailProvider: InMemoryMailProvider
let stu: LogoutUseCase;

describe("Logout (unit)", () => {
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
        stu = new LogoutUseCase(
            usersTokensRepositoryInMemory,
        )

        // criar usuário
        await usersRepositoryInMemory.create({
            id: 'id-user-1',
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to logout", async () => {
        const {refreshToken, user} = await loginUseCase.execute({
            email: 'user1-test@email.com',
            password: '123456'
        })

        await stu.execute({ 
            refreshToken,
            idUser: user.id
        });
        
        const userToken = await usersTokensRepositoryInMemory.findByToken(refreshToken)

        expect(userToken).toEqual(null)
    });

    test("Should not be able to verify a account with token not found", async () => {
        await expect(()=> stu.execute({ 
         refreshToken: 'fake-refresh-token',
         idUser: 'fake-id-user'
     }),
         ).rejects.toBeInstanceOf(ResourceNotFoundError)
     });

});