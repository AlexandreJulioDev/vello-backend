import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilita o CORS (aceita o Front-end local e o de produção na Vercel)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://vello-front-end-n1g2.vercel.app',
    ],
    credentials: true,
  });

  // 2. Ativa a Validação Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Configuração do Swagger com a marca Vello
  const config = new DocumentBuilder()
    .setTitle('Vello - Gestão Inteligente SaaS')
    .setDescription('Plataforma unificada para gerenciamento de provedores, clientes e planos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 4. Porta dinâmica: Railway define PORT automaticamente, local usa 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n==============================================`);
  console.log(`🚀 Vello SaaS (Back-end) rodando na porta: ${port}`);
  console.log(`📖 Documentação disponível em: /api`);
  console.log(`==============================================\n`);
}
bootstrap();

