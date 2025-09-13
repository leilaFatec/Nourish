import { Controller } from '../contracts/Controller';
import { SignInUseCase} from '@application/usecases/SignInUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { SignInBody, signInSchema } from './auth/schemas/SignInSchema';
import { Schema } from '@kernel/decorators/Schema';

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<SignInController.Response> {
  constructor(private readonly SignInUseCase: SignInUseCase) { 
    super();
  }
 
  protected override async handle(
    {body} : Controller.Request<SignInBody>,
  ): Promise<Controller.Response<SignInController.Response>> {
    const { email, password } = body;
    
    const {
      accessToken,
      refreshToken,
    } = await this.SignInUseCase.execute({
      email,
      password,
    });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
     },
    };
   }
  }
  
  export namespace SignInController {
    export type Response = {
      accessToken: string;
      refreshToken: string;
    }
  }