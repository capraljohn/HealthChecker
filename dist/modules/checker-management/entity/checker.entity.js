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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerEntity = void 0;
const typeorm_1 = require("typeorm");
const checker_entity_enum_1 = require("../types/checker-entity.enum");
let CheckerEntity = class CheckerEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CheckerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_name', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CheckerEntity.prototype, "serviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_service', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CheckerEntity.prototype, "urlService", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: checker_entity_enum_1.CheckerEntityEnum,
        default: checker_entity_enum_1.CheckerEntityEnum.AVAILABLE,
    }),
    __metadata("design:type", String)
], CheckerEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unavailable_from', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CheckerEntity.prototype, "unavailableFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unavailable_to', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CheckerEntity.prototype, "unavailableTo", void 0);
CheckerEntity = __decorate([
    (0, typeorm_1.Entity)('HealthChecker')
], CheckerEntity);
exports.CheckerEntity = CheckerEntity;
//# sourceMappingURL=checker.entity.js.map