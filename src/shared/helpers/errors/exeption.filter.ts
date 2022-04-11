import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { ExeptionInterface } from './exeption.interface';
import { HTTPError } from './exepton.service';
import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements ExeptionInterface {
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			console.error(`Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			console.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
