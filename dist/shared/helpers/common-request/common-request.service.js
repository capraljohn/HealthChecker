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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRequestService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../../../types");
const exeption_filter_1 = require("../errors/exeption.filter");
const checker_entity_1 = require("../../../modules/checker-management/entity/checker.entity");
const typeorm_constant_1 = require("../../../modules/config/typeorm.constant");
const axios_1 = __importDefault(require("axios"));
const config_service_1 = require("../../../modules/config/config.service");
const date_fns_1 = require("date-fns");
const checker_entity_enum_1 = require("../../../modules/checker-management/types/checker-entity.enum");
const exepton_service_1 = require("../errors/exepton.service");
let CommonRequestService = class CommonRequestService {
    constructor(exeptionFilter, configService) {
        this.exeptionFilter = exeptionFilter;
        this.configService = configService;
        this.checkerRepository = typeorm_constant_1.connectionSource.getRepository(checker_entity_1.CheckerEntity);
    }
    requestOnUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentServices = yield this.checkerRepository
                .createQueryBuilder('hc')
                .select()
                .getMany();
            for (const url of currentServices) {
                try {
                    const { status } = yield axios_1.default.get(url.urlService);
                    const currentDate = (0, date_fns_1.format)((0, date_fns_1.endOfDay)(new Date()), 'yyyy-MM-dd|HH:mm:ss');
                    if (url.unavailableTo === null && status === (404 | 500 | 422)) {
                        yield this.checkerRepository.update(url.id, {
                            unavailableTo: currentDate,
                            status: checker_entity_enum_1.CheckerEntityEnum.UNAVAILABLE,
                        });
                    }
                    if (url.unavailableTo !== null && status === (404 | 500 | 422)) {
                        yield this.checkerRepository.update(url.id, {
                            status: checker_entity_enum_1.CheckerEntityEnum.UNAVAILABLE,
                        });
                    }
                    if (url.unavailableTo !== null && status !== (404 | 500 | 422)) {
                        yield this.checkerRepository.update(url.id, {
                            unavailableFrom: currentDate,
                            status: checker_entity_enum_1.CheckerEntityEnum.AVAILABLE,
                        });
                    }
                }
                catch (err) {
                    new exepton_service_1.HTTPError(400, 'Bad request');
                }
            }
        });
    }
};
CommonRequestService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ExeptionFilter)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [exeption_filter_1.ExeptionFilter,
        config_service_1.ConfigService])
], CommonRequestService);
exports.CommonRequestService = CommonRequestService;
//# sourceMappingURL=common-request.service.js.map