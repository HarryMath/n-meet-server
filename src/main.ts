import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { AppInterceptor } from './app.interceptor';

const port = parseInt(process.env.PORT) || 3000;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new AppInterceptor());
  app.enableCors();
  await app.listen(port);
}
bootstrap().then(() => console.warn('application listen on port ' + port));
