import { Controller } from '@application/contracts/Controller';
import { GetProfileAndGoalQuery } from '@application/query/GetProfileAndGoalQuery';
import { Injectable } from '@kernel/decorators/Injectable';


@Injectable()
export class GetMeController extends Controller<'private', GetMeController.Response> {
  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super();
  }
  protected override async handle({
    accountId,
  }: Controller.Request<'private'>): Promise<Controller.Response<GetMeController.Response>> {
    await this.getProfileAndGoalQuery.execute({accountId});
    return {
      statusCode: 200,
      body: {
        accountId,
     },
    };
   }
  }
  

  export namespace GetMeController {
    export type Response = {
      accountId: string;      
    }
  }