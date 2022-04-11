"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.MailerService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../../../types");
const config_service_1 = require("../../config/config.service");
const nodemailer_1 = require("nodemailer");
let MailerService = class MailerService {
    constructor(configService) {
        this.configService = configService;
    }
    sendToEmail(consumer, type, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const firstConfig = (0, nodemailer_1.createTransport)({
                service: 'gmail',
                host: 'check@gmail.com',
                auth: { user: this.configService.get('GMAIL'), pass: this.configService.get('PASSWORD') },
            });
            const payload = {
                from: 'HealthChecker',
                to: consumer,
                subject: 'Service' + ' ' + type,
                text: body,
            };
            return yield firstConfig.sendMail(payload);
        });
    }
};
MailerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=emailer.service.js.map