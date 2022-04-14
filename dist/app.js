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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("./types");
const checker_controller_1 = require("./modules/checker-management/checker.controller");
const typeorm_config_service_1 = require("./modules/config/typeorm-config.service");
const exeption_filter_1 = require("./shared/helpers/errors/exeption.filter");
const common_request_service_1 = require("./shared/helpers/common-request/common-request.service");
let App = class App {
    constructor(checkerController, typeormConfigService, commonRequestService, exeptionFilter) {
        this.checkerController = checkerController;
        this.typeormConfigService = typeormConfigService;
        this.commonRequestService = commonRequestService;
        this.exeptionFilter = exeptionFilter;
        this.app = (0, express_1.default)();
        this.port = 3000;
    }
    useMiddleware() {
        this.app.use((0, body_parser_1.json)());
    }
    useRouters() {
        this.app.use('/healthcheck', this.checkerController.router);
    }
    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }
    customCrone() {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.commonRequestService.requestOnUrl();
        }), 5000);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.typeormConfigService.ormClient();
            this.useMiddleware();
            this.useRouters();
            this.useExeptionFilters();
            this.customCrone();
            this.server = this.app.listen(this.port);
            console.info(`Server has been started on port: ${this.port}`);
        });
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CheckerController)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.TypeormConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CommonRequestService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ExeptionFilter)),
    __metadata("design:paramtypes", [checker_controller_1.CheckerController,
        typeorm_config_service_1.TypeormConfigService,
        common_request_service_1.CommonRequestService,
        exeption_filter_1.ExeptionFilter])
], App);
exports.App = App;
//# sourceMappingURL=app.js.map