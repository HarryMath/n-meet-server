"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.port = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ResponseInspector_1 = require("./inspectors/ResponseInspector");
const socket_io_1 = require("socket.io");
exports.port = parseInt(process.env.PORT) || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new ResponseInspector_1.ResponseInspector());
    app.enableCors();
    exports.httpServer = app.getHttpServer();
    exports.io = new socket_io_1.Server(exports.httpServer);
    exports.io.on('connection', (client) => {
        console.log('a user connected: ' + client.conn.id);
        client.on('send-message', (payload) => {
            payload.userIP = client.conn.id;
            client.broadcast.emit('message', payload);
        });
    });
    await app.listen(exports.port);
}
bootstrap().then(() => console.warn('application listen on port ' + exports.port));
//# sourceMappingURL=main.js.map