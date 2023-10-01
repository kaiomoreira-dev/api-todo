import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { VerifyEmailUseCase } from "./verify-email-usecase";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { RegisterUseCase } from "../register/register-usecase";
import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { User } from "@prisma/client";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let registerUseCase: RegisterUseCase;
let stu: VerifyEmailUseCase;

describe("Verify email user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        sendMailProvider = new InMemoryMailProvider()
        dayjsDateProvider = new DayjsDateProvider()
        registerUseCase = new RegisterUseCase(
            usersRepositoryInMemory, 
            dayjsDateProvider,
            usersTokensRepositoryInMemory,
            sendMailProvider
        )
        stu = new VerifyEmailUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory,
            dayjsDateProvider
        )

        vi.useFakeTimers()
    });

    afterEach(()=>{
        vi.useFakeTimers()
    })

    test("Should be able to verify a new account", async () => {
        const {user} = await registerUseCase.execute({
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id)

        await stu.execute({ 
            token: userToken?.token as string,
            email: 'user1-test@email.com'
        });

        const userActive = await usersRepositoryInMemory.findByEmail('user1-test@email.com') as User

        expect(userActive.emailActive).toBe(true)
    });

    test("Should not be able to verify a new account with Email already exists", async () => {
        const email = 'email@notexists.com'

       await expect(()=> stu.execute({ 
        token: 'xxx',
        email,
    }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    test("Should not be able to verify a account with token not found", async () => {
       await expect(()=> stu.execute({ 
        token: 'xxx',
        email: 'user1-test@email.com',
    }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    test("Should not be able to verify a account with token expired", async () => {
        vi.setSystemTime( new Date(2023, 8, 23, 19, 0, 0))
        const {user} = await registerUseCase.execute({
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id)

        vi.setSystemTime( new Date(2023, 8, 23, 23, 0, 0))

        await expect(()=> stu.execute({ 
         token: userToken?.token as string,
         email: 'user1-test@email.com',
     }),
         ).rejects.toBeInstanceOf(AccessTimeOutError)
     });
});