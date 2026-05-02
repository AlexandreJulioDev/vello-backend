import { Controller } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}
  // Roteamento específico para criação de Admins/Funcionários será feito em módulos dedicados,
  // ou a gente pode expandir aqui depois se necessário.
}
