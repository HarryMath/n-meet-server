"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.port = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ResponseInspector_1 = require("./inspectors/ResponseInspector");
const rooms_service_1 = require("./services/rooms.service");
exports.port = parseInt(process.env.PORT) || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new ResponseInspector_1.ResponseInspector());
    app.enableCors();
    exports.httpServer = app.getHttpServer();
    rooms_service_1.RoomsService.createSocket(exports.httpServer);
    await app.listen(exports.port);
}
bootstrap().then(() => console.warn('application listen on port ' + exports.port));
//# sourceMappingURL=main.js.map