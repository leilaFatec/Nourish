import { Controller } from '@application/contracts/Controller';
import { SignInUseCase} from '@application/usecases/auth/SignInUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { SignInBody, signInSchema } from './schemas/signInSchema';
import { Schema } from '@kernel/decorators/Schema';

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<'public', SignInController.Response> {
  constructor(private readonly SignInUseCase: SignInUseCase) { 
    super();
  }
 
  protected override async handle(
    {body} : Controller.Request<'public', SignInBody>,
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