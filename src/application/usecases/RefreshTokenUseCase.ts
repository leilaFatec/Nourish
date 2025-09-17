import { AccountRepository } from "@infra/database/dynamo/repositories/AccountRepository";
import { AuthGateway } from "@infra/gateways/AuthGateway";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
  private readonly authGateway: AuthGateway,
  private readonly accountRepo: AccountRepository,
   ){}

  async execute({
    refreshToken, 
  }: RefreshTokenUseCase.Input): Promise<RefreshTokenUseCase.Output> {    
    const{
      accessToken: newAccesToken,
      refreshToken: newRefreshToken,  
    } = await this.authGateway.refreshToken({ refreshToken });

    return {
      accessToken: newAccesToken,
      refreshToken: newRefreshToken, 
    };
  }
}

export namespace RefreshTokenUseCase{
  export type Input = {
    refreshToken: string;
  };
  
  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}