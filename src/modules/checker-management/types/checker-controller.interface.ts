import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export interface CheckerControllerInterface {
	getCurrentServicesList: (req: Request, res: Response, next: NextFunction) => void;
	getStatusService: (req: Request, res: Response, next: NextFunction) => void;
	createService: (req: Request, res: Response, next: NextFunction) => void;
	updateService: (req: Request, res: Response, next: NextFunction) => void;
	removeService: (req: Request, res: Response, next: NextFunction) => void;
}
