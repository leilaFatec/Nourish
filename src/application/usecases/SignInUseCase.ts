import { AuthGateway } from "@infra/gateways/AuthGateway";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class SignInUseCase {
  constructor(
  private readonly authGateway: AuthGateway,
  
   ){}

  async execute({
    email,
    password,
  }: SignInUseCase.Input): Promise<SignInUseCase.Output> {    
    const{
      accessToken,
      refreshToken, 
    } = await this.authGateway.signIn({ email, password });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignInUseCase{
  export type Input = {
    email: string;
    password: string;
  };
  
  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}