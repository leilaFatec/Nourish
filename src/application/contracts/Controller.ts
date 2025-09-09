export abstract class Controller<TBody>{
protected abstract handle(params: Controller.Request): Promise<Controller.Response<TBody>>;

public execute(params: Controller.Request): Promise<Controller.Response<TBody>>{
  console.log('Execute do Controller rodou...');
  return this.handle(params);
}
}
 
export namespace Controller{
  export type Request<
    TBody = Record<string, unknown>, 
    TParams = Record<string, unknown>, 
    TQueryParams = Record<string, unknown>,
 > = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
};
export type Response<TBody = undefined> = {
  statusCode: number;
  body?: TBody;
};
}
