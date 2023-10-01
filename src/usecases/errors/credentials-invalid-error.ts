export class CredentialsInvalidError extends Error{
    constructor(){
        super('Credentials invalid for login!')
    }
}