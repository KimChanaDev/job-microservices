import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request.cookies?.Authentication || request.token,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('AUTH_JWT_SECRET'),
        });
    }

    // if successful we get the JWT payload here
    override validate(payload: TokenPayload): TokenPayload {
        return payload;
    }
}
