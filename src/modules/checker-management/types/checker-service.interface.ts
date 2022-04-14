import { CheckerGetListDto } from '../dto/checker-get-list.dto';
import { NextFunction } from 'express';
import { CheckerGetByIdDto } from '../dto/checker-get.dto';
import { CheckerCreateDto } from '../dto/checker-create.dto';
import { CheckerUpdateDto } from '../dto/checker-update.dto';
import { CheckerRemoveDto } from '../dto/checker-remove.dto';

export interface CheckerServiceInterface {
	getCurrentServicesList: (param: CheckerGetListDto, next: NextFunction) => Promise<void | any[]>;
	getStatusServiceById: (body: CheckerGetByIdDto, next: NextFunction) => Promise<void | object>;
	createService: (param: CheckerCreateDto, next: NextFunction) => Promise<void | object>;
	updateService: (param: CheckerUpdateDto, next: NextFunction) => Promise<void | object>;
	removeService: (param: CheckerRemoveDto, next: NextFunction) => Promise<void | string>;
}
