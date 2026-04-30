import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Ativa a Validação Global (Usa os DTOs para barrar dados errados)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
  }));

  // 2. Configuração do Swagger com a marca Vello
  const config = new DocumentBuilder()
    .setTitle('Vello - Gestão Inteligente SaaS')
    .setDescription(
      'Plataforma unificada para gerenciamento de provedores, clientes e planos',
    )
    .setVersion('1.0')
    .addBearerAuth() // Mantém o cadeado para o Token JWT no Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  // Logs personalizados com a sua marca
  console.log(`\n==============================================`);
  console.log(`🚀 Vello SaaS rodando em: http://localhost:3000`);
  console.log(`📖 Documentação disponível em: http://localhost:3000/api`);
  console.log(`==============================================\n`);
}
bootstrap();
