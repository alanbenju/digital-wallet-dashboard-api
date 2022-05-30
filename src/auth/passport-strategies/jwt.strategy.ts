import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * JWTStrategy is used by passport for every endpoint. Use @Public to avoid it
 * JWTStrategy validates the jwt sent from the client to validate the logged user
 * jwt must be sent on the header as a bearer token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        console.log("vladite", payload)
        return { id: payload.sub, username: payload.username };
    }
}
