import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // In production, you might want to validate the user exists and is active
    // For now, we'll just return the payload with the user's refresh token
    const user = await this.authService.validateJwtPayload({
      sub: payload.sub,
      email: payload.email,
      role: payload.role as any,
    });

    // Attach the refresh token from the database to the request
    return {
      ...payload,
      sub: user.id,
      email: user.email,
      role: user.role,
      refreshToken: user.refreshToken,
    };
  }
}
