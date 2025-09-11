import  { z } from 'zod';
import { ErrorCode } from '../../application/errors/ErrorCode';

interface ILambdaErrorResponseParams{
    statusCode: number;
    code: ErrorCode;
    message: any;
}
export function lambdaErrorResponse({
  code,
  message,
  statusCode,
}: ILambdaErrorResponseParams) {
   return {
      statusCode: 500,
      body: JSON.stringify({
        error:{
          code,
          message,
        },
      }),
  }; 
}