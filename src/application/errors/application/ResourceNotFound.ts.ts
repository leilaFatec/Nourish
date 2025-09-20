import {ErrorCode} from '@application/errors/ErrorCode';
import { ApplicationError} from './ApplicationError';

export class ResourceNotFound extends ApplicationError{
  public override statusCode = 404;
  
  public override code: ErrorCode;

  constructor(message?: string) {
    super();

    this.name = 'ResourceNotFound';
    this.message = message??'The resource not found';
    this.code =  ErrorCode.RESOURCE_NOT_FOUND;
  }
}