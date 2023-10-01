import { Message } from "./in-memory/in-memory-mail-provider";

export interface IMailProvider {
    sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string, 
        pathTemplate:string
    ): Promise<void>

    findMessageSent(email: string): Promise<Message>
}