import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { User } from 'shared/dtos/user.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserPipe implements PipeTransform<string, Promise<User>> {
  constructor(private readonly userService: UserService) {}

  async transform(value: string): Promise<User> {
    try {
      const user = await this.userService.findOne({ _id: value });
      if (user) {
        return user;
      }
    } catch (e: any) {}

    throw new BadRequestException(`User with id ${value} not found`);
  }
}
