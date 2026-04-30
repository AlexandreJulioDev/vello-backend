import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrai o token do cabeçalho "Authorization: Bearer <TOKEN>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // A chave deve ser a mesma usada no AuthModule
      secretOrKey: 'MINHA_CHAVE_SECRETA_123', 
    });
  }

  // O NestJS chama isso automaticamente se o token for válido
  async validate(payload: any) {
    // Retorna os dados que ficarão disponíveis em req.user
    return { 
      userId: payload.sub, 
      email: payload.email, 
      id_provedor: payload.id_provedor 
    };
  }
}
