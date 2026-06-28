import { EnvironmentService } from '@config/environment/services';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environmentService = app.get(EnvironmentService);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors(environmentService.cors);

  const config = new DocumentBuilder()
    .setTitle("Template Service's API")
    .setDescription(
      `Template Service's API
  <br>Created by: <b>Franccesco Jaimes Agreda</b>
  <br>GitHub: <a href="https://github.com/Franccesco1907" target="_blank">Franccesco1907</a>
  <br>Linkedin: <a href="https://www.linkedin.com/in/franccesco-michael-jaimes-agreda-7a00511a8/" target="_blank">Franccesco Michael Jaimes Agreda</a>
  <br>Gmail: <a href="mailto:franccescojaimesagreda@gmail.com">franccescojaimesagreda@gmail.com</a>
  `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag("Template Service's API")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(environmentService.apiPort);
}

bootstrap();
