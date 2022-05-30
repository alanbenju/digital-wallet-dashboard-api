import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators';
import { SignupUserDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) {}

    @Post('signup')
    @Public()
    async signup(@Body() signupUser: SignupUserDto) {
        //TODO: use middleware
        const user = await this.userService.findOneByUsername(
            signupUser.username,
        );
        if (user) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); // TODO: Handle with custom errors
        return this.authService.signup(signupUser);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @Public()
    async login(@Req() req) {
        return this.authService.login(req.user);
    }
}
