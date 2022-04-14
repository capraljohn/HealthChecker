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
exports.CheckerController = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const base_controller_1 = require("../../shared/base.controller");
const types_1 = require("../../types");
const checker_get_dto_1 = require("./dto/checker-get.dto");
const checker_create_dto_1 = require("./dto/checker-create.dto");
const checker_update_dto_1 = require("./dto/checker-update.dto");
const checker_remove_dto_1 = require("./dto/checker-remove.dto");
const validate_middleware_1 = require("../../shared/validate.middleware");
const checker_get_list_dto_1 = require("./dto/checker-get-list.dto");
let CheckerController = class CheckerController extends base_controller_1.BaseController {
    constructor(configService, checkerService) {
        super();
        this.configService = configService;
        this.checkerService = checkerService;
        this.bindRoutes([
            {
                path: '/services',
                method: 'get',
                func: this.getCurrentServicesList,
                middlewares: [new validate_middleware_1.ValidateMiddleware(checker_get_list_dto_1.CheckerGetListDto)],
            },
            {
                path: '/service/:id/status',
                method: 'get',
                func: this.getStatusService,
                middlewares: [new validate_middleware_1.ValidateMiddleware(checker_get_dto_1.CheckerGetByIdDto)],
            },
            {
                path: '/service/create',
                method: 'post',
                func: this.createService,
                middlewares: [new validate_middleware_1.ValidateMiddleware(checker_create_dto_1.CheckerCreateDto)],
            },
            {
                path: '/service/:id/update',
                method: 'put',
                func: this.updateService,
                middlewares: [new validate_middleware_1.ValidateMiddleware(checker_update_dto_1.CheckerUpdateDto)],
            },
            {
                path: '/service/:id/delete',
                method: 'delete',
                func: this.removeService,
                middlewares: [new validate_middleware_1.ValidateMiddleware(checker_remove_dto_1.CheckerRemoveDto)],
            },
        ]);
    }
    getCurrentServicesList({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.checkerService.getCurrentServicesList(body, next);
            this.sendMessage(res, 200, list);
        });
    }
    getStatusService({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.checkerService.getStatusServiceById(body, next);
            this.sendMessage(res, 200, status);
        });
    }
    createService({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const create = yield this.checkerService.createService(body, next);
            this.sendMessage(res, 201, { created: create });
        });
    }
    updateService({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.checkerService.updateService(body, next);
            this.sendMessage(res, 200, { updated: update });
        });
    }
    removeService({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const remove = yield this.checkerService.removeService(body, next);
            this.sendMessage(res, 200, { message: `Service with id: ${remove} removed` });
        });
    }
};
CheckerController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CheckerService)),
    __metadata("design:paramtypes", [Object, Object])
], CheckerController);
exports.CheckerController = CheckerController;
//# sourceMappingURL=checker.controller.js.map