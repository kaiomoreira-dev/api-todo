import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";

async function run() {
const ehtreal = await EtherealProvider.createTransporter();

    const pathTemplate = './views/emails/verify-email.hbs'
    await ehtreal.sendEmail(
        'email@email.test', 
        'Kaio Moreira', 
        'Redefinição de Senha', 
        'link', 
        pathTemplate 
    );

}
run();