import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserSignup } from '../dtos/user-signup.dto';
const passwordValidator = require('joi-password-complexity');

@Injectable()
export class UserSignupPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}

  async transform(userSignup: UserSignup) {
    // Make sure the user is actually available
    const availability = await this.authService.availability(userSignup);
    if (!availability.username || !availability.email) {
      throw new BadRequestException('Username or email is not available');
    }

    // Make sure the password meets requirements
    const complexityValidation = passwordValidator(this.authService.passwordComplexity).validate(userSignup.password);
    if (complexityValidation.error) {
      throw new BadRequestException(complexityValidation.error);
    }

    // This is a valid user signup
    return userSignup;
  }
}
