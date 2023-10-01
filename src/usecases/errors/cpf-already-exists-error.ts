export class CPFAlreadyExistsError extends Error{
    constructor(){
        super('CPF already exists!')
    }
}