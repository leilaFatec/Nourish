import { Controller } from '../contracts/Controller';
import { SignUpUseCase} from '@application/usecases/SignUpUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { SignUpBody, signUpSchema } from './auth/schemas/SignUpSchema';
import { Schema } from '@kernel/decorators/Schema';

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<SignUpController.Response> {
  constructor(private readonly signUpUseCase: SignUpUseCase) { 
    super();
  }
 
  protected override async handle(
    {body} : Controller.Request<SignUpBody>,
  ): Promise<Controller.Response<SignUpController.Response>> {
    const { account } = body;
    
    const {
      accessToken,
      refreshToken,
    } = await this.signUpUseCase.execute(account);

    return {
      statusCode: 201,
      body: {
        accessToken,
        refreshToken,
     },
    };
   }
  }
  

  export namespace SignUpController {
    export type Response = {
      accessToken: string;
      refreshToken: string;
    }
  }