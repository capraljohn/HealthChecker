"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = exports.appModule = void 0;
const inversify_1 = require("inversify");
const app_1 = require("./app");
const types_1 = require("./types");
const checker_service_1 = require("./modules/checker-management/checker.service");
const checker_controller_1 = require("./modules/checker-management/checker.controller");
const config_service_1 = require("./modules/config/config.service");
const typeorm_config_service_1 = require("./modules/config/typeorm-config.service");
const exeption_filter_1 = require("./shared/helpers/errors/exeption.filter");
const mailer_service_1 = require("./modules/send-response-management/mailer/mailer.service");
const telegram_service_1 = require("./modules/send-response-management/telegram/telegram.service");
const common_request_service_1 = require("./shared/helpers/common-request/common-request.service");
exports.appModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.TypeormConfigService)
        .to(typeorm_config_service_1.TypeormConfigService)
        .inSingletonScope();
    bind(types_1.TYPES.CommonRequestService)
        .to(common_request_service_1.CommonRequestService)
        .inSingletonScope();
    bind(types_1.TYPES.CheckerController).to(checker_controller_1.CheckerController);
    bind(types_1.TYPES.CheckerService).to(checker_service_1.CheckerService);
    bind(types_1.TYPES.ExeptionFilter).to(exeption_filter_1.ExeptionFilter);
    bind(types_1.TYPES.TelegramService).to(telegram_service_1.TelegramService);
    bind(types_1.TYPES.MailerService).to(mailer_service_1.MailerService);
    bind(types_1.TYPES.ConfigService).to(config_service_1.ConfigService).inSingletonScope();
    bind(types_1.TYPES.Application).to(app_1.App);
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const appContainer = new inversify_1.Container();
        appContainer.load(exports.appModule);
        const app = appContainer.get(types_1.TYPES.Application);
        yield app.init();
        return { appContainer, app };
    });
}
exports.boot = bootstrap();
//# sourceMappingURL=main.js.map