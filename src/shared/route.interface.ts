import { NextFunction, Request, Response, Router } from 'express';
import { MiddlewareInterface } from './middleware.interface';

export interface RouteControllerInterface {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: MiddlewareInterface[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
