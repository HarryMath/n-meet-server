import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from "@nestjs/common";
import { ResponseInspector } from "./inspectors/ResponseInspector";
import { RoomsService } from "./services/rooms.service";

export const port = parseInt(process.env.PORT) || 3000;
export let httpServer;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInspector());
  app.enableCors();
  httpServer = app.getHttpServer();
  RoomsService.createSocket(httpServer);
  await app.listen(port);
}
bootstrap().then(() =>
    console.warn('application listen on port ' + port)
);
