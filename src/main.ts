import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from "@nestjs/common";
import { ResponseInspector } from "./inspectors/ResponseInspector";
import { Server } from "socket.io";

export const port = parseInt(process.env.PORT) || 3000;
export let httpServer;

export let io;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInspector());
  app.enableCors();
  httpServer = app.getHttpServer();
  io = new Server(httpServer);
  io.on('connection', (client) => {
    console.log('a user connected: ' + client.conn.id);
    client.on('send-message', (payload: any) => {
      payload.userIP = client.conn.id;
      client.broadcast.emit('message', payload);
    });
  })
  await app.listen(port);
}
bootstrap().then(() =>
    console.warn('application listen on port ' + port)
);
