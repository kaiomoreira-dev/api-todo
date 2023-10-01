import { IMailProvider } from "../interface-mail-provider";

export interface Message{
    email: string
    name: string
    subject: string
    link: string
    textTemplate: string
}

export class InMemoryMailProvider implements IMailProvider{
    private messages: Message[] = []

    constructor(){
        this.messages = this.messages
    }
    async findMessageSent(email: string): Promise<Message> {
        const message = this.messages.find(message => message.email === email) as Message

        return message
    }

    async sendEmail(
        email: string, 
        name: string, 
        subject: string, 
        link: string, 
        pathTemplate: string
        ){
        
        const message = {
            email,
            name,
            subject,
            link,
            textTemplate: pathTemplate
        }

        this.messages.push(message)
    }
}