import { NextFunction, Request, Response } from 'express';

interface errorProps {
  stack: string;
  status: number;
  message: string;
}

const ErrorController = (err: errorProps, req: Request, res: Response,next:NextFunction) => {
  console.error(err,req,res,next); // Log the error stack
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
};

export default ErrorController;
