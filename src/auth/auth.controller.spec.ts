import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let userService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, UsersService, JwtStrategy],
            imports: [
                TypeOrmModule.forFeature([User]),
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '60m' },
                }),
            ],
        })
            .overrideProvider(getRepositoryToken(User))
            .useValue({})
            .compile();

        authController = moduleRef.get<AuthController>(AuthController);
        userService = moduleRef.get<UsersService>(UsersService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    describe('Authentication', () => {
        it('Signup and login: Should return access token', async () => {
            const result = { access_token: '' };
            jest.spyOn(userService, 'findOneByUsername').mockImplementation(
                () => Promise.resolve(undefined as User),
            );
            jest.spyOn(userService, 'create').mockImplementation(() =>
                Promise.resolve({ username: 'alanb', id: 1 } as User),
            );
            jest.spyOn(jwtService, 'sign').mockImplementation(() => '');
            const response = await authController.signup({
                username: 'alanb',
                password: '123456',
            });
            expect(response.toString()).toBe(result.toString());
        });

        it('Signup: Should thrown forbidden exception because user already exists', async () => {
            jest.spyOn(userService, 'findOneByUsername').mockImplementation(
                () => Promise.resolve({ username: 'alanb', id: 1 } as User),
            );
            const response = authController.signup({
                username: 'alanb',
                password: '123456',
            });
            expect(response).rejects.toThrow(
                new HttpException('Forbidden', HttpStatus.FORBIDDEN),
            );
        });

        /*
        TODO: Missing tests:
         - passport integration
         - login with wrong pass/no user
        */
    });
});
