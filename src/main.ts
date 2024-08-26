/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new AuthGuard());
  app.use(auth(auth0Config));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: (errors) => {
      const cleanErrors = errors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints
        }
      })
      return new BadRequestException({
        alert: "Se han detectado los siguientes errores en la peticion y mandamos este mesaje personalizado",
        errors: cleanErrors,
      })
    }

  }));
  app.use(loggerGlobal);

  const swaggerCoinfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription('Esta es unaAPI para probar Nest en BackEnd')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCoinfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}



bootstrap();