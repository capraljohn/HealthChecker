import { NextFunction, Request, Response } from 'express';

export interface ExeptionInterface {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
