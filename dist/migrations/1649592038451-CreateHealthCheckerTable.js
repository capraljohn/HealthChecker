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
exports.CreateHealthCheckerTable1649592038451 = void 0;
class CreateHealthCheckerTable1649592038451 {
    constructor() {
        this.name = 'CreateHealthCheckerTable1649592038451';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TYPE "public"."HealthChecker_status_enum" AS ENUM('available', 'unavailable')`);
            yield queryRunner.query(`CREATE TABLE "HealthChecker" ("id" BIGSERIAL NOT NULL, "service_name" character varying, "url_service" character varying, "status" "public"."HealthChecker_status_enum" NOT NULL DEFAULT 'available', "unavailable_from" character varying, "unavailable_to" character varying, CONSTRAINT "PK_5ef98a876e9dfadad6448c490ef" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "HealthChecker"`);
            yield queryRunner.query(`DROP TYPE "public"."HealthChecker_status_enum"`);
        });
    }
}
exports.CreateHealthCheckerTable1649592038451 = CreateHealthCheckerTable1649592038451;
//# sourceMappingURL=1649592038451-CreateHealthCheckerTable.js.map