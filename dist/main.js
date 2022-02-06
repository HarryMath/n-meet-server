"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ResponseInspector_1 = require("./inspectors/ResponseInspector");
const port = parseInt(process.env.PORT) || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new ResponseInspector_1.ResponseInspector());
    app.enableCors();
    await app.listen(port);
}
bootstrap().then(() => console.warn('application listen on port ' + port));
//# sourceMappingURL=main.js.map