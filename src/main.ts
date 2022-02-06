import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ResponseInspector } from './inspectors/ResponseInspector';

const port = parseInt(process.env.PORT) || 3000;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInspector());
  app.enableCors();
  await app.listen(port);
}
bootstrap().then(() => console.warn('application listen on port ' + port));
