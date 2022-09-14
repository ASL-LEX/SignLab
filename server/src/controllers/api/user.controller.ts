import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { UserService } from '../../services/user.service';
import { Auth } from '../../guards/auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get all user information for all users.
   */
  @Get('/')
  @Auth('admin')
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Add a role to the given user
   *
   * @param role The role to add to the user
   * @param id The of the user to add the role to
   */
  @Put('/:role/:id')
  @Auth('admin')
  async addRoleToUser(@Param('role') role: string, @Param('id') id: string) {
    const result = await this.userService.addRole(role, id);

    if (result) {
      return;
    } else {
      throw new HttpException(
        `Could not add role to user ID ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Remove a role from the given user
   *
   * @param role The role to remove from the user
   * @param id The id of the user to remove the role from
   */
  @Delete('/:role/:id')
  @Auth('admin')
  async removeRoleFromUser(
    @Param('role') role: string,
    @Param('id') id: string,
  ) {
    const result = await this.userService.removeRole(role, id);

    if (result) {
      return;
    } else {
      throw new HttpException(
        `Could not remove role from user ID ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
