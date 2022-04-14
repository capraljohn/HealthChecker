"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExeptionFilter = void 0;
const inversify_1 = require("inversify");
const exepton_service_1 = require("./exepton.service");
require("reflect-metadata");
let ExeptionFilter = class ExeptionFilter {
    catch(err, req, res, next) {
        if (err instanceof exepton_service_1.HTTPError) {
            console.error(`Error ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send({ err: err.message });
        }
        else {
            console.error(`${err.message}`);
            res.status(500).send({ err: err.message });
        }
    }
};
ExeptionFilter = __decorate([
    (0, inversify_1.injectable)()
], ExeptionFilter);
exports.ExeptionFilter = ExeptionFilter;
//# sourceMappingURL=exeption.filter.js.map