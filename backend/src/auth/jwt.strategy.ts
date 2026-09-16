import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config"; // 1. Импортируем ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 2. Внедряем ConfigService в конструктор
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 3. Достаем ключ через configService вместо process.env
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
