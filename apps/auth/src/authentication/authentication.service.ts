import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { isProdEnv, TokenPayload } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    public async login(loginInput: LoginInput, response: Response) {
        const user = await this.verifyUser(loginInput.email, loginInput.password);
        const expires = new Date();
        expires.setMilliseconds(
            expires.getTime() +
            parseInt(this.configService.getOrThrow('AUTH_JWT_EXPIRATION_MS'))
        );
        const tokenPayload: TokenPayload = {
            userId: user.id,
        };
        const accessToken = this.jwtService.sign(tokenPayload);
        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: isProdEnv(this.configService), //https only for production
            expires,
        });
        return user;
    }

    private async verifyUser(email: string, password: string) {
        try {
            const user = await this.usersService.getUser({
                email,
            });

            const isValid = await compare(password, user.password);
            if (!isValid) {
                throw new UnauthorizedException();
            }
            return user;
        } catch {
            throw new UnauthorizedException('Credentials are invalid');
        }
    }
}
