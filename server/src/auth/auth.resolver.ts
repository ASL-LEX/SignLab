import { ConfigService } from '@nestjs/config';
import { Query, Resolver } from '@nestjs/graphql';
import { ComplexityOptions } from 'joi-password-complexity';
import { PasswordComplexity } from './dtos/complexity-requirements.dto';



@Resolver()
export class AuthResolver {
  constructor(private readonly configService: ConfigService) {}

  @Query(() => PasswordComplexity)
  getPasswordComplexity(): ComplexityOptions {
    return this.configService.getOrThrow('auth.passwordComplexity');
  }
}
