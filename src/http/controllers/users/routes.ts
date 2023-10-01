import { FastifyInstance } from 'fastify'
import { RegisterUser } from './register/register-user-controller'
import { LoginUser } from './login/login-user-controller'
import { VerifyEmail } from './verify-email/verify-email-controller'
import { LogoutUser } from './logout/logout-user-controller'
import { SendForgotPassword } from './send-forgot-password/send-forgot-password'
import { ResetPassword } from './reset-password/reset-password-controller'
import { FindUser } from './find/find-user-controller'
import { DeleteUser } from './delete/delete-user-controller'
import { UpdateUser } from './update-full/update-user-controller'
import { verifyTokenJWT } from '@/http/middlewares/verify-token-jwt'
export async function usersRoutes(fastifyApp: FastifyInstance) {
    // register user
    fastifyApp.post('/', RegisterUser)

    // login user
    fastifyApp.post('/login', LoginUser)

    // logout user
    fastifyApp.post('/logout', {onRequest: [verifyTokenJWT]}, LogoutUser)

    // verify e-mail user
    fastifyApp.patch('/verify-email', VerifyEmail)

    // send forgot password user
    fastifyApp.post('/forgot-password', SendForgotPassword)

    // reset password user
    fastifyApp.patch('/reset-password', ResetPassword)

    // find user
    fastifyApp.get('/:id', {onRequest: [verifyTokenJWT]}, FindUser)

    // update user
    fastifyApp.put('/', {onRequest: [verifyTokenJWT]}, UpdateUser)

    // delete user
    fastifyApp.delete('/:id', {onRequest: [verifyTokenJWT]}, DeleteUser)
}
