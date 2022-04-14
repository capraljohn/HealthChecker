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
exports.CheckerService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const checker_entity_1 = require("./entity/checker.entity");
const typeorm_constant_1 = require("../config/typeorm.constant");
const exepton_service_1 = require("../../shared/helpers/errors/exepton.service");
const types_1 = require("../../types");
let CheckerService = class CheckerService {
    constructor(mailerService, telegramService) {
        this.mailerService = mailerService;
        this.telegramService = telegramService;
        this.checkerRepository = typeorm_constant_1.connectionSource.getRepository(checker_entity_1.CheckerEntity);
    }
    getCurrentServicesList(param, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, sendTg } = param;
            const serviceList = yield this.checkerRepository.find();
            if (!serviceList) {
                return next(new exepton_service_1.HTTPError(204, 'No data available'));
            }
            let message = '';
            const services = [];
            serviceList.map((service) => {
                services.push({
                    id: service.id,
                    name: service.serviceName,
                    url: service.urlService,
                    status: service.status,
                });
                message +=
                    `Id: ${service.id}\n` +
                        `Service ${service.serviceName} ${service.status}\n` +
                        `Url ${service.urlService}\n\n`;
            });
            if (email) {
                yield this.mailerService.sendToEmail(email, 'updating', message);
            }
            if (sendTg) {
                yield this.telegramService.sendToChat(message, sendTg);
            }
            return services;
        });
    }
    getStatusServiceById(body, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, email, sendTg } = body;
            const serviceStatus = yield this.checkerRepository.findOne({
                where: { id: serviceId },
            });
            if (!serviceStatus) {
                return next(new exepton_service_1.HTTPError(404, 'Such service not found'));
            }
            const payloadResponse = `Service ${serviceStatus.serviceName} ${serviceStatus.status}\n` +
                `Unavailable from ${serviceStatus.unavailableFrom} to ${serviceStatus.unavailableTo}`;
            if (email) {
                yield this.mailerService.sendToEmail(email, 'updating', payloadResponse);
            }
            if (sendTg) {
                yield this.telegramService.sendToChat(payloadResponse, sendTg);
            }
            return {
                name: serviceStatus.serviceName,
                status: serviceStatus.status,
                unavailableFrom: serviceStatus.unavailableFrom,
                unavailableTo: serviceStatus.unavailableTo,
            };
        });
    }
    createService(param, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, name, email, sendTg } = param;
            const findService = yield this.checkerRepository.find({
                where: { urlService: url },
            });
            for (const service of findService) {
                if (service.urlService === url) {
                    return next(new exepton_service_1.HTTPError(400, 'Such service has been created'));
                }
            }
            yield this.checkerRepository.save({
                serviceName: name,
                urlService: url,
            });
            const payloadResponse = `Service create with name ${param.name}\n` + `Url ${param.url}/n`;
            if (email) {
                yield this.mailerService.sendToEmail(email, 'updating', payloadResponse);
            }
            if (sendTg) {
                yield this.telegramService.sendToChat(payloadResponse, sendTg);
            }
            return { name: name, url: url };
        });
    }
    updateService(param, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, name, serviceId, email, sendTg } = param;
            const serviceExist = yield this.checkerRepository.findOne({
                where: {
                    id: serviceId,
                },
            });
            if (!serviceExist) {
                return next(new exepton_service_1.HTTPError(404, 'Service with such id not exist'));
            }
            const updatingService = this.checkerRepository.create({});
            if (name) {
                updatingService.serviceName = name;
            }
            if (url) {
                updatingService.urlService = url;
            }
            yield this.checkerRepository.update(serviceExist.id, updatingService);
            const payloadResponse = `Service update\n` + `Name ${param.name}\n` + `Url ${param.url}`;
            if (email) {
                yield this.mailerService.sendToEmail(email, 'updating', payloadResponse);
            }
            if (sendTg) {
                yield this.telegramService.sendToChat(payloadResponse, sendTg);
            }
            return {
                name: param === null || param === void 0 ? void 0 : param.name,
                url: param === null || param === void 0 ? void 0 : param.url,
            };
        });
    }
    removeService(param, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, email, sendTg } = param;
            const serviceExist = yield this.checkerRepository.findOne({
                where: {
                    id: serviceId,
                },
            });
            if (!serviceExist) {
                return next(new exepton_service_1.HTTPError(404, 'Service with such id not found'));
            }
            yield this.checkerRepository.delete(serviceId);
            const payloadResponse = `Service with id: ${serviceId} removed`;
            if (email) {
                yield this.mailerService.sendToEmail(email, 'updating', payloadResponse);
            }
            if (sendTg) {
                yield this.telegramService.sendToChat(payloadResponse, sendTg);
            }
            return serviceId;
        });
    }
};
CheckerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.MailerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TelegramService)),
    __metadata("design:paramtypes", [Object, Object])
], CheckerService);
exports.CheckerService = CheckerService;
//# sourceMappingURL=checker.service.js.map