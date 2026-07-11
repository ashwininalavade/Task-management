import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform/transform.interceptor';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor);

  //swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management App')
    .setDescription('Task Management APIs')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const PORT = 3000;
  await app.listen(process.env.PORT ?? PORT);
  logger.log(`Server is listening on port ${PORT}`);
}
bootstrap();
