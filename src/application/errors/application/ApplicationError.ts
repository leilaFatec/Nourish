import { ErrorCode }  from '@application/errors/ErrorCode';

export abstract class ApplicationError extends Error{
  public statusCode?: number;
  
  public abstract code: ErrorCode;
}