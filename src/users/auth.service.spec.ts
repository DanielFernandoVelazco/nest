/* eslint-disable prettier/prettier */
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { JwtService } from "@nestjs/jwt";
import { UsersDbService } from "./usersDb.service";
import { User } from "./users.entity";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

describe('authService', () => {

    let authService: AuthService
    let mockUsersService: Partial<UsersDbService>
    const mockUser: Omit<User, 'id'> = {
        name: 'Caceres',
        created_at: '2022-12-12',
        password: '123456',
        email: 'QjKQK@example.com',
        isAdmin: false
    }

    const mockJwtService = {
        sign: (payload) => jwt.sign(payload, 'testSecret')
    }

    beforeEach(async () => {
        mockUsersService = {
            getUserByEmail: () => Promise.resolve(undefined),
            saveUser: (user: Omit<User, 'id'>): Promise<User> => Promise.resolve({
                ...user,
                isAdmin: false,
                id: '1234fs-241sd-24csfd-34sdfg',
            })
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: JwtService, useValue: mockJwtService },
                {
                    provide: UsersDbService,
                    useValue: mockUsersService
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService);

    })

    it('Create an instance of AuthService', async () => {
        expect(authService).toBeDefined()
    })

    it('SingUp create a new user with an encripted password', async () => {
        const user = await authService.signUp(mockUser)
        expect(user).toBeDefined()
        expect(user.password).not.toEqual(mockUser.password)
    })

    it('signUp throws an error if email already in use', async () => {
        mockUsersService.getUserByEmail = (email: string) => Promise.resolve(mockUser as User)
        try {
            await authService.signUp(mockUser as User)
        } catch (error) {
            expect(error.message).toEqual('Email already in use')
        }
    })

    it('singIn() retuns an error if the password is innvalid', async () => {
        mockUsersService.getUserByEmail = (email: string) => Promise.resolve(mockUser as User)
        try {
            await authService.signIn(mockUser.email, 'Invalid Password')
        } catch (error) {
            expect(error.message).toEqual('Invalid password')
        }
    })

    it('singIn() retuns an error if the user is not found', async () => {
        try {
            await authService.signIn(mockUser.email, mockUser.password)
        } catch (error) {
            expect(error.message).toEqual('User not found')
        }
    })

    it('signIn() return an object with a message and a token if the user is found and the password is valid', async () => {
        const mockUserVariant = {
            ...mockUser,
            password: await bcrypt.hash(mockUser.password, 10)
        }
        mockUsersService.getUserByEmail = (email: string) => Promise.resolve(mockUserVariant as User)

        const response = await authService.signIn(mockUser.email, mockUser.password)
        expect(response).toBeDefined()
        expect(response.token).toBeDefined()
        expect(response.success).toEqual('User logged in successfully')
    })
})

