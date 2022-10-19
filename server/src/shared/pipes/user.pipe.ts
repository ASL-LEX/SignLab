import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { User } from 'shared/dtos/user.dto';
import { UserService } from '../../user/user.service';


@Injectable()
export class UserPipe implements PipeTransform<string, Promise<User>> {
  constructor(private readonly userService: UserService) {}

  async transform(value: string, _metatype: ArgumentMetadata): Promise<User> {
    const user = await this.userService.findOne({ _id: value });
    if (!user) {
      throw new BadRequestException(`User with id ${value} not found`);
    }
    return user;
  }
}
